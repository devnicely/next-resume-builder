import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Secret key check
  if (req.headers["x-secret-key"] !== process.env.SECRET_KEY) {
    return res.status(403).end();
  }

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    // Update all organizations where planType is "FREE" and set availableCredits to 5
    const updateResponse = await prisma.organization.updateMany({
      where: {
        planType: "FREE",
      },
      data: {
        availableCredits: 5,
      },
    });

    // Respond with the number of records updated
    res.status(200).json({ updated: updateResponse.count });
  } catch (error) {
    console.error("Error updating credits: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
