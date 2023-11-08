import { buffer } from "micro";
import Stripe from "stripe";
import {
  handleCheckoutCompleted,
  handleInvoicePaymentFailed,
  handlePaidInvoice,
  handleSubscription,
  handleUpcomingInvoice,
} from "~/server/api/stripe-webhook-handlers/stripe-webhook-handlers";
import { prisma } from "~/server/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const buf = await buffer(req);

    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted({ event, prisma });
        break;
      case "invoice.paid":
        await handlePaidInvoice({ event, prisma });
        break;

      case "customer.subscription.updated":
        await handleSubscription({ event, prisma, stripe });
        break;
      case "invoice.upcoming":
        await handleUpcomingInvoice({ event, prisma });
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed({ event, prisma });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    await prisma.stripeEvent.create({
      data: {
        id: event.id,
        type: event.type,
        object: event.object,
        api_version: event.api_version,
        account: event.account,
        created: new Date(event.created * 1000),
        data: {
          object: event.data.object,
          previous_attributes: event.data.previous_attributes,
        },
        livemode: event.livemode,
        pending_webhooks: event.pending_webhooks,
        request: {
          id: event.request?.id,
          idempotency_key: event.request?.idempotency_key,
        },
      },
    });
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
