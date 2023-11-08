export const SUBSCRIPTIONPLANS = [
  {
    name: "Free Plan",
    planType: "FREE",
    billingCycle: ["MONTHLY", "YEARLY"],
    priceMonthly: 0,
    priceYearly: 0,
    description: ["Parsing and formatting: 5/month "],
    availableCredits: {
      monthly: 5,
      yearly: 60,
    },
  },
  {
    name: "Standard Plan",
    planType: "STANDARD",
    billingCycle: ["MONTHLY", "YEARLY"],
    priceMonthly: 199,
    priceYearly: 2149,
    description: ["Parsing and formatting: 1000/month "],
    stripePriceIds: {
      monthly: "price_1O0GlFJIpXDRFXoxlO5oxIZY",
      yearly: "price_1O0GmTJIpXDRFXoxf45oVoHP",
    },
    availableCredits: {
      monthly: 1000,
      yearly: 12000,
    },
  },
  {
    name: "Premium Plan",
    planType: "PREMIUM",
    billingCycle: ["MONTHLY", "YEARLY"],
    priceMonthly: 249,
    priceYearly: 2689,
    description: ["Parsing and formatting: 2000/month "],
    stripePriceIds: {
      monthly: "price_1O0GntJIpXDRFXoxgkU2y3re",
      yearly: "price_1O0GoHJIpXDRFXoxsu6LqJEh",
    },
    availableCredits: {
      monthly: 2000,
      yearly: 24000,
    },
  },
];
