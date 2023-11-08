import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-08-16",
  typescript: true,
});

export const MY_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://www.prospectai.ai"
    : "http://localhost:3000";

// async function testStripeConnection() {
//   try {
//     const balance = await stripe.balance.retrieve();
//     console.log("Stripe connected successfully:", balance);
//   } catch (error) {
//     console.log("Error connecting to Stripe:", error);
//   }
// }

// testStripeConnection();
