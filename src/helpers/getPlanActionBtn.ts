type PlanType = "FREE" | "STANDARD" | "PREMIUM" | "ENTERPRISE";
type BillingCycle = "MONTHLY" | "YEARLY";

type PlanDetails = {
  name: string;
  planType: PlanType;
  billingCycle: BillingCycle;
};

const getPlanAction = ({
  currentPlanType,
  selectedPlanType,
  isYearlyEnabled,
  currentIsYearly,
}: {
  currentPlanType: PlanDetails;
  selectedPlanType: PlanDetails;
  isYearlyEnabled: boolean;
  currentIsYearly: boolean;
}) => {
  const planRanks = {
    FREE: 0,
    STANDARD: 1,
    PREMIUM: 2,
    ENTERPRISE: 3,
  };

  if (currentPlanType === "FREE") {
    return "Choose Plan";
  }

  if (currentIsYearly && !isYearlyEnabled) {
    return "Not Allowed";
  }
  if (currentIsYearly && selectedPlanType === "FREE") {
    return "Not Allowed";
  }
  const currentRank = planRanks[currentPlanType];
  const selectedRank = planRanks[selectedPlanType];

  if (currentRank < selectedRank) {
    return "Upgrade Plan";
  }

  if (currentRank > selectedRank) {
    return "Downgrade Plan";
  }

  if (isYearlyEnabled) {
    return "Upgrade Plan";
  }

  return "Choose Plan";
};

export default getPlanAction;
