import type { PrismaClient, StripeSubscriptionStatus } from "@prisma/client";
import type Stripe from "stripe";
import { stripe } from "~/server/config/stripeConfig";
import { TRPCError } from "@trpc/server";

export type StripeCustomerIdResponse = {
  id: string;
};

type UpdatedOrganizationType = {
  id: string;
  stripeCustomerId: string;
};

interface CTX {
  prisma: PrismaClient;
  // ...other fields
}

interface HandleArgs {
  event: Stripe.Event;
  prisma: PrismaClient;
}

export const getOrCreateStripeCustomerIdForOrganization = async ({
  prisma,
  organizationId,
  ctx,
  userId,
  planType,
  stripePriceId,
  availableCredits,
  billingCycle,
}: {
  ctx: CTX;
  prisma: PrismaClient;
  organizationId: string;
  userId: string;
  planType?: string;
  stripePriceId?: string;
  availableCredits: number;
  billingCycle: string;
}): Promise<StripeCustomerIdResponse | undefined> => {
  try {
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!organization) throw new Error("Organization not found");

    if (organization.stripeCustomerId) {
      return organization.stripeCustomerId;
    }

    const customer = await stripe.customers.create({
      metadata: {
        organizationId: organizationId,
        userId: userId,
        planType: planType!,
        stripePriceId: stripePriceId!,
        availableCredits: availableCredits!,
        billingCycle: billingCycle,
      },
    });

    const updatedOrganization = (await ctx.prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    })) as UpdatedOrganizationType;

    if (updatedOrganization.stripeCustomerId) {
      return updatedOrganization.stripeCustomerId;
    }
  } catch (error) {
    console.log(error);
  }
};

//when user buy credits
export const handleCheckoutCompleted = async ({
  event,
  prisma,
}: HandleArgs) => {
  const session = event.data.object as Stripe.Checkout.Session;

  const invoiceId = session.payment_intent;

  const organizationId = session.metadata.organizationId;
  const userId = session.metadata.userId;
  const numberOfCredits = parseInt(session.metadata.numberOfCredits, 10);
  const totalPrice = parseInt(session.metadata.totalPrice, 10);

  if (!userId) {
    console.log("No userId found");
    return;
  }
  try {
    await prisma.$transaction([
      prisma.creditPurchase.create({
        data: {
          organizationId,
          userId,
          stripeCheckoutSessionId: session.id,
          purchasedCredits: numberOfCredits,
          amount: totalPrice / 100,
          planType: "CREDIT",
          invoiceId,
        },
      }),

      prisma.organization.update({
        where: { id: organizationId },
        data: {
          additionalCredits: {
            increment: numberOfCredits,
          },
        },
      }),
    ]);
  } catch (error) {
    console.log(error);
  }
};

export const handlePaidInvoice = async ({ event, prisma }: HandleArgs) => {
  try {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.subscription as string;

    // Retrieve the full Subscription object from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["customer"],
    });

    const operationType = subscription.metadata.operationType;
    if (operationType === "creditPurchase") return;

    // Retrieve the payment method from Stripe
    const paymentMethodId = subscription.default_payment_method as string;
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    const organizationId = subscription.customer.metadata.organizationId;
    const userId = subscription.customer.metadata.userId;
    const billingCycle = subscription.customer.metadata.billingCycle;
    const stripePriceId = subscription.items.data[0].price.id;
    const planType = subscription.customer.metadata.planType as PlanType;
    const availableCredits = parseInt(
      subscription.customer.metadata.availableCredits,
      10
    );

    // Transaction starts here
    await prisma.$transaction([
      prisma.organization.update({
        where: { id: organizationId },
        data: {
          stripeCustomerId: subscription.customer.id,
          stripeSubscriptionId: subscription.id,
          stripeSubscriptionStatus:
            subscription.status as StripeSubscriptionStatus,
          planType: planType,
          availableCredits: availableCredits,
          usedAvailableCredits: 0,
          billingCycle: billingCycle,
        },
      }),
      prisma.subscriptionPayment.create({
        data: {
          organizationId: organizationId,
          userId: userId,
          stripePriceId: stripePriceId,
          planType: planType,
          paymentStatus: "SUCCEEDED",
          invoiceId: invoice.id,
          isAcknowledged: false,
          subscriptionStartDate: new Date(
            subscription.current_period_start * 1000
          ),
          subscriptionEndDate: new Date(subscription.current_period_end * 1000),
          last4: paymentMethod.card?.last4 ?? null,
          cardBrand: paymentMethod.card?.brand ?? null,
          amount: subscription.items.data[0].price.unit_amount / 100,
          availableCredits: availableCredits,
          billingCycle: billingCycle,
        },
      }),
    ]);
    // Transaction ends here
  } catch (error) {
    console.error("Failed to handle invoice.paid event:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to process invoice.paid event: ${error.message}`,
    });
  }
};

export const handleSubscription = async ({ event, prisma }: HandleArgs) => {
  try {
    const subscription = event.data.object as Stripe.Subscription;
    const previousAttributes = event.data
      .previous_attributes as Stripe.Subscription;
    const organizationId = subscription.metadata.organizationId;

    const operationType = subscription.metadata.operationType;
    if (operationType === "creditPurchase") return;

    if (!organizationId) {
      throw new Error("Missing organizationId in subscription metadata");
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (previousAttributes && "cancel_at_period_end" in previousAttributes) {
      if (subscription.cancel_at_period_end === true) {
        if (organization?.pendingPlanType) {
          await handlePlanChange(prisma, organizationId, subscription);
        } else {
          await handleCancel(prisma, organizationId, subscription);
        }
      } else {
        await handleRenew(prisma, organizationId, subscription);
      }
    }
  } catch (error) {
    console.error(
      "Failed to handle customer.subscription.updated event:",
      error
    );
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to process customer.subscription.updated event: ${error.message}`,
    });
  }
};

const handleCancel = async (
  prisma: PrismaClient,
  organizationId: string,
  subscription: Stripe.Subscription
) => {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { availableCredits: true },
  });

  const remainingCredits = organization?.availableCredits ?? 5;

  await prisma.$transaction([
    prisma.organization.update({
      where: { id: organizationId },
      data: {
        stripeSubscriptionStatus: "canceled",
        planType: "FREE",
        // availableCredits: remainingCredits,
        usedAvailableCredits: remainingCredits,
      },
    }),
    prisma.subscriptionPayment.update({
      where: {
        organizationId_invoiceId: {
          organizationId,
          invoiceId: subscription.latest_invoice as string,
        },
      },
      data: {
        cancelDate: new Date(subscription.cancel_at * 1000),
      },
    }),
  ]);
};

const handleRenew = async (
  prisma: PrismaClient,
  organizationId: string,
  subscription: Stripe.Subscription
) => {
  const previousPlanType = subscription.metadata.planType;

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { availableCredits: true },
  });

  const remainingCredits = organization?.availableCredits ?? 0;

  await prisma.$transaction([
    prisma.organization.update({
      where: { id: organizationId },
      data: {
        stripeSubscriptionStatus: "active",
        planType: previousPlanType ?? "FREE",
        // availableCredits: remainingCredits,
        usedAvailableCredits: remainingCredits,
      },
    }),
    prisma.subscriptionPayment.update({
      where: {
        organizationId_invoiceId: {
          organizationId,
          invoiceId: subscription.latest_invoice as string,
        },
      },
      data: {
        cancelDate: null,
      },
    }),
  ]);
};

const handlePlanChange = async (
  prisma: PrismaClient,
  organizationId: string,
  subscription: Stripe.Subscription
) => {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  const pendingPlanType = organization?.pendingPlanType;
  const pendingStripePriceId = organization?.pendingStripePriceId;
  const pendingNewPlanCredits = organization?.pendingNewPlanCredits;
  const pendingBillingCycle = organization?.pendingBillingCycle;

  if (!pendingPlanType || !pendingStripePriceId) {
    console.error("Missing pending plan or price ID");
    return;
  }

  // Update the Stripe subscription to the new plan
  try {
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
      items: [
        {
          id: subscription.items.data[0].id,
          price: pendingStripePriceId,
        },
      ],
    });
  } catch (error) {
    console.error("Failed to update Stripe subscription:", error);
    throw new Error("Failed to update Stripe subscription");
  }

  // Update the organization in your database
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      stripeSubscriptionStatus: "active",
      pendingPlanType: null,
      pendingStripePriceId: null,
      planType: pendingPlanType,
      availableCredits: pendingNewPlanCredits,
      billingCycle: pendingBillingCycle,
    },
  });

  // Update a new SubscriptionPayment record
  await prisma.subscriptionPayment.update({
    where: {
      organizationId_invoiceId: {
        organizationId,
        invoiceId: subscription.latest_invoice as string,
      },
    },
    data: {
      cancelDate: new Date(subscription.current_period_end * 1000),
      planType: pendingPlanType,
    },
  });
};

export const handleUpcomingInvoice = async ({
  event,
  prisma,
}: // notificationService,  // Assume this is some service you have for sending notifications
{
  event: Stripe.Event;
  prisma: PrismaClient;
  // notificationService: NotificationService; // Replace with your actual notification service type
}) => {
  // const invoice = event.data.object as Stripe.Invoice;
  // const userId = invoice.customer; // Replace with the actual user identification logic
  // // Send a notification about the upcoming invoice
  // notificationService.sendUpcomingInvoiceNotification(userId);
};

export const handleInvoicePaymentFailed = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  try {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.subscription;

    const fullSubscription = await stripe.subscriptions.retrieve(
      subscriptionId,
      {
        expand: ["customer"],
      }
    );
    const operationType = fullSubscription.metadata.operationType;
    if (operationType === "creditPurchase") return;

    const organizationId = fullSubscription.customer.metadata.organizationId;

    const failedRecord = await prisma.subscriptionPayment.findFirst({
      where: {
        organizationId,
        paymentStatus: PaymentStatus.FAILED,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (failedRecord) {
      // Increment attempts by 1
      await prisma.subscriptionPayment.update({
        where: { id: failedRecord.id },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });
    } else {
      await prisma.subscriptionPayment.create({
        data: {
          organizationId,
          paymentStatus: PaymentStatus.FAILED,
          attempts: 1,
        },
      });
    }

    await prisma.organization.update({
      where: { id: organizationId! },
      data: {
        planType: "FREE",
        stripeSubscriptionStatus: "unpaid",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
