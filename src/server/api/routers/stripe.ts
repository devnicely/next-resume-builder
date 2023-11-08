import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripe, MY_DOMAIN } from "~/server/config/stripeConfig";
import { TRPCError } from "@trpc/server";
import { getOrCreateStripeCustomerIdForOrganization } from "../stripe-webhook-handlers/stripe-webhook-handlers";
import { roleAuthorization } from "~/server/middleware/roleAuthorization";

export const stripeRouter = createTRPCRouter({
  createStripeCheckoutSession: protectedProcedure
    .input(
      z.object({
        stripePriceId: z.string(),
        organizationId: z.string(),
        planType: z.string(),
        availableCredits: z.number(),
        billingCycle: z.string(),
      })
    )
    .use(roleAuthorization(["admin", "owner"]))
    .mutation(async ({ input, ctx }) => {
      try {
        const { prisma } = ctx;
        const {
          stripePriceId,
          organizationId,
          planType,
          availableCredits,
          billingCycle,
        } = input;
        const userId = ctx.session.user.userId;
        const existingSubscription = await prisma.organization.findUnique({
          where: { id: organizationId },
          select: { stripeSubscriptionStatus: true },
        });

        if (
          existingSubscription &&
          existingSubscription.stripeSubscriptionStatus === "active"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Organization already has an active subscription.",
          });
        }

        if (!stripePriceId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No Stripe Price ID provided.",
          });
        }

        const customerId = await getOrCreateStripeCustomerIdForOrganization({
          prisma,
          organizationId,
          ctx,
          userId,
          planType,
          stripePriceId,
          availableCredits,
          billingCycle,
        });

        if (!customerId) {
          throw new Error("Could not create customer");
        }

        const checkoutSession = await stripe.checkout.sessions.create({
          customer: customerId,
          client_reference_id: organizationId,
          payment_method_types: ["card"],
          mode: "subscription",
          line_items: [
            {
              price: stripePriceId,
              quantity: 1,
            },
          ],
          success_url: `${MY_DOMAIN}/user/organization/billing-plans?organizationId=${organizationId}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${MY_DOMAIN}/user/organization/billing-plans`,
          subscription_data: {
            metadata: {
              organizationId,
              planType,
            },
          },
          metadata: {
            operationType: "creditPurchase",
          },
        });

        if (!checkoutSession) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not create checkout session",
          });
        }

        return { url: checkoutSession.url };
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),
  createStripePortalSession: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        planType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { prisma } = ctx;
        const { organizationId, planType } = input;
        const userId = ctx.session.user.userId;
        const customerId = await getOrCreateStripeCustomerIdForOrganization({
          prisma,
          organizationId,
          ctx,
          userId,
          planType,
        });

        const organization = await ctx.prisma.organization.findUnique({
          where: {
            id: organizationId,
          },
        });

        if (organization?.stripeSubscriptionStatus !== "active") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Organization is not subscribed and cannot access the Stripe Portal.",
          });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: `${MY_DOMAIN}/user/organization/billing-plans`,
        });

        return { url: portalSession.url };
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),
  queryUnacknowledgedPayments: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .use(roleAuthorization(["admin", "owner"]))
    .query(async ({ input, ctx }) => {
      try {
        const { organizationId } = input;
        const userId = ctx.session.user.userId;

        const orgMembership = await ctx.prisma.orgMembership.findFirst({
          where: {
            userId: userId,
            orgId: organizationId,
          },
          select: {
            orgId: true,
          },
        });

        if (!orgMembership) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `User is not a member of the organization with ID ${organizationId}`,
          });
        }

        const unacknowledgedPayments =
          await ctx.prisma.subscriptionPayment.findMany({
            where: {
              organizationId: organizationId,
              isAcknowledged: {
                not: true,
              },
            },
            select: {
              id: true,
            },
          });

        const updatedPaymentIds = [];
        for (const payment of unacknowledgedPayments) {
          const updatedPayment = await ctx.prisma.subscriptionPayment.update({
            where: { id: payment.id },
            data: { isAcknowledged: true },
          });
          updatedPaymentIds.push(updatedPayment.id);
        }

        return {
          updatedPaymentIds,
          success: true,
        };
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),
  queryBillingPayments: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .use(roleAuthorization(["admin", "owner"]))
    .query(async ({ input, ctx }) => {
      try {
        const { organizationId } = input;
        const userId = ctx.session.user.userId;

        const orgMembership = await ctx.prisma.orgMembership.findFirst({
          where: {
            userId: userId,
            orgId: organizationId,
          },
          select: {
            orgId: true,
          },
        });

        if (!orgMembership) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `User is not a member of the organization with ID ${organizationId}`,
          });
        }

        const billingPayments = await ctx.prisma.subscriptionPayment.findMany({
          where: {
            organizationId: organizationId,
          },
          orderBy: {
            subscriptionEndDate: "desc",
          },
          select: {
            planType: true,
            subscriptionStartDate: true,
            subscriptionEndDate: true,
            invoiceId: true,
            isAcknowledged: true,
            paymentStatus: true,
            last4: true,
            cardBrand: true,
            amount: true,
            billingCycle: true,
          },
        });

        const latestBilling = billingPayments[0] ?? null;

        const creditPurchases = await ctx.prisma.creditPurchase.findMany({
          where: {
            organizationId: organizationId,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            planType: true,
            purchasedCredits: true,
            stripeCheckoutSessionId: true,
            createdAt: true,
            amount: true,
            invoiceId: true,
          },
        });

        return {
          billingPayments,
          creditPurchases,
          latestBilling,
          success: true,
        };
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),
  fetchReceiptUrl: protectedProcedure
    .input(z.object({ invoiceId: z.string(), planType: z.string() }))
    .mutation(async ({ input }) => {
      const { invoiceId, planType } = input;

      try {
        let paymentIntentId;
        let receiptUrl;

        if (planType === "CREDIT") {
          const paymentIntent = await stripe.paymentIntents.retrieve(invoiceId);
          const latestChargeId = paymentIntent.latest_charge;
          const charge = await stripe.charges.retrieve(latestChargeId);
          receiptUrl = charge.receipt_url;
        } else {
          // For subscriptions (all other planTypes)
          const invoice = await stripe.invoices.retrieve(invoiceId);
          receiptUrl = invoice.hosted_invoice_url;
        }

        return {
          success: true,
          receiptUrl,
        };
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),

  markForUpgrade: protectedProcedure
    .input(
      z.object({
        newPlanType: z.string(),
        newStripePriceId: z.string(),
        orgId: z.string(),
        pendingNewPlanCredits: z.number(),
        pendingBillingCycle: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const {
          newPlanType,
          newStripePriceId,
          orgId,
          pendingNewPlanCredits,
          pendingBillingCycle,
        } = input;

        const organization = await ctx.prisma.organization.findFirst({
          where: { id: orgId },
        });

        if (!organization || !organization.stripeSubscriptionId) {
          throw new Error("Organization or Stripe Subscription not found.");
        }

        if (newPlanType === "FREE") {
          await stripe.subscriptions.cancel(organization.stripeSubscriptionId);
          ///add logic to handle subscripayment to null or something
          await ctx.prisma.organization.update({
            where: { id: organization.id },
            data: {
              stripeSubscriptionStatus: "canceled",
              planType: "FREE",
              pendingPlanType: null,
              pendingStripePriceId: null,
              availableCredits: organization.availableCredits,
            },
          });
        } else {
          // Set cancel_at_period_end to true for the current subscription
          await stripe.subscriptions.update(organization.stripeSubscriptionId, {
            cancel_at_period_end: true,
          });

          // Set the pendingPlanType and pendingStripePriceId
          await ctx.prisma.organization.update({
            where: { id: organization.id },
            data: {
              pendingPlanType: newPlanType,
              pendingStripePriceId: newStripePriceId,
              pendingNewPlanCredits: pendingNewPlanCredits,
              pendingBillingCycle: pendingBillingCycle,
            },
          });
        }
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),
  purchaseAdditionalCredits: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        totalPrice: z.string(),
        numberOfCredits: z.string(),
      })
    )
    .use(roleAuthorization(["admin", "owner"]))
    .mutation(async ({ input, ctx }) => {
      try {
        const { organizationId, numberOfCredits, totalPrice } = input;
        const userId = ctx.session.user.userId;
        const checkoutSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Additional Credits",
                  description: `Purchase of ${numberOfCredits} additional credits`,
                },
                unit_amount: parseInt(totalPrice),
              },
              quantity: 1,
            },
          ],
          metadata: {
            operationType: "creditPurchase",
            organizationId,
            userId,
            numberOfCredits,
            totalPrice,
          },
          success_url: `${MY_DOMAIN}/user/organization/billing-plans?organizationId=${organizationId}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${MY_DOMAIN}/user/organization/billing-plans`,
          mode: "payment",
        });

        return { url: checkoutSession.url };
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),
});
