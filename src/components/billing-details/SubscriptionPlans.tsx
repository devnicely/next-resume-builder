import React, { useState, Fragment, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { api } from "~/utils/api";
import Toggle from "../common/Toggle";
import SpinnerButton from "../common/SpinnerButton";
import { useUserProfile } from "~/context/UserProfileContext";
import { classNames } from "../common/Classnames";
import { notifyError } from "../ReactHotToast";
import { handleTRPCError } from "~/server/errors/handleTRPCError";
import getPlanAction from "~/helpers/getPlanActionBtn";
import AlertModal from "../common/AlertModal";
import { ChevronDown, ChevronUp } from "lucide-react";

const SubscriptionPlans = ({
  plans,
  selectedPlan,
  setSelectedPlan,
  orgDetails,
}) => {
  const [openPlan, setOpenPlan] = useState<boolean>(false);

  const { profile, organization } = useUserProfile();
  const [enabled, setEnabled] = useState(
    orgDetails?.organization.billingCycle === "YEARLY" ? true : false
  );

  const [open, setOpen] = useState(false);
  const {
    mutateAsync: createStripeCheckoutSession,
    isLoading,
    data,
    isSuccess,
  } = api.stripe.createStripeCheckoutSession.useMutation();

  const { mutateAsync: markForUpgrade } =
    api.stripe.markForUpgrade.useMutation();

  useEffect(() => {
    if (data ?? (data?.url && isSuccess)) {
      window.location.href = data.url;
    }
  }, [data]);

  const handleSpinnerClick = async ({
    selectedPlan,
    enabled,
    profile,
    organization,
    orgDetails,
  }) => {
    const currentPlan = orgDetails?.organization.planType;

    if (currentPlan && currentPlan !== "FREE") {
      setOpen(true);
    } else {
      if (selectedPlan ?? selectedPlan.stripePriceIds) {
        const stripePriceId = enabled
          ? selectedPlan.stripePriceIds.yearly
          : selectedPlan.stripePriceIds.monthly;

        const availableCredits = enabled
          ? selectedPlan.availableCredits.yearly
          : selectedPlan.availableCredits.monthly;

        if (stripePriceId) {
          try {
            await createStripeCheckoutSession({
              stripePriceId,
              userId: profile?.user.id,
              organizationId: organization?.organization.id,
              planType: selectedPlan.planType,
              availableCredits,
              billingCycle: enabled ? "YEARLY" : "MONTHLY",
            });
          } catch (error) {
            const message = handleTRPCError(error);
            notifyError({ message });
          }
        }
      }
    }
  };

  const upgradePlan = async () => {
    try {
      const newPlanType = selectedPlan.planType;
      let newStripePriceId = null;
      let newCredits = null;

      if (selectedPlan.stripePriceIds) {
        newStripePriceId = enabled
          ? selectedPlan.stripePriceIds.yearly
          : selectedPlan.stripePriceIds.monthly;
        newCredits = enabled
          ? selectedPlan.availableCredits.yearly
          : selectedPlan.availableCredits.monthly;
      }

      await markForUpgrade({
        newPlanType,
        newStripePriceId,
        orgId: organization.organization.id,
        newCredits,
        pendingBillingCycle: enabled ? "YEARLY" : "MONTHLY",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const action = getPlanAction({
    currentPlanType: orgDetails?.organization.planType,
    selectedPlanType: selectedPlan?.planType,
    isYearlyEnabled: enabled,
    currentIsYearly:
      orgDetails?.organization.billingCycle === "YEARLY" ? true : false,
  });

  const buttonClass =
    action === "Not Allowed"
      ? "hover:bg-red-600 bg-red-500"
      : "hover:bg-primary bg-primary-600";

  const getModalMessage = () => {
    if (selectedPlan?.planType === "FREE") {
      return "You are about to downgrade to the Free plan. Your downgrade will take effect on the next billing cycle.";
    }
    if (action === "Not Allowed") {
      return "You cannot downgrade.";
    }
    return "Your upgrade will take effect on the next billing cycle.";
  };

  useEffect(() => {
    setEnabled(orgDetails?.organization.billingCycle === "YEARLY");
  }, [orgDetails]);

  useEffect(() => {
    if (orgDetails?.organization) {
      const plan = plans.find(
        (p) =>
          p.planType === orgDetails.organization.planType &&
          p.billingCycle.includes(orgDetails.organization.billingCycle)
      );
      setSelectedPlan(plan);
    }
  }, [orgDetails]);

  return (
    <div className="mt-5">
      <div className="flex justify-end mb-3">
        <Toggle enabled={enabled} setEnabled={setEnabled} />
        <AlertModal
          open={open}
          setOpen={setOpen}
          actionBtn={action ? "OK" : "Upgrade"}
          func={action ? () => {} : upgradePlan}
          title={selectedPlan?.planType === "FREE" ? "Downgrade" : "Upgrade"}
          message={getModalMessage()}
        />
      </div>
      <RadioGroup
        value={selectedPlan}
        onChange={(newPlan) => {
          setSelectedPlan(newPlan);
          setOpenPlan(null);
        }}
      >
        <RadioGroup.Label className="sr-only">Pricing plans</RadioGroup.Label>
        <div className="relative -space-y-px rounded-md bg-white">
          {plans.map((plan, planIdx) => (
            <RadioGroup.Option
              key={plan.name}
              checked={
                orgDetails?.organization.planType === plan.planType &&
                orgDetails?.organization.billingCycle ===
                  (enabled ? "YEARLY" : "MONTHLY")
              }
              value={plan}
              className={({ checked }) =>
                classNames(
                  planIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                  planIdx === plans.length - 1
                    ? "rounded-bl-md rounded-br-md"
                    : "",
                  checked
                    ? "z-10 border-primary-200 bg-primary-50"
                    : "border-gray-200",
                  "relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-3 md:pl-4 md:pr-6"
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <span className="flex items-center text-sm">
                    <span
                      className={classNames(
                        checked
                          ? "bg-primary-600 border-transparent"
                          : "bg-white border-gray-300",
                        active ? "ring-2 ring-offset-2 ring-primary-600" : "",
                        "h-4 w-4 rounded-full border flex items-center justify-center"
                      )}
                      aria-hidden="true"
                    >
                      <span className="rounded-full bg-white w-1.5 h-1.5" />
                    </span>
                    <RadioGroup.Label
                      as="span"
                      className={classNames(
                        checked ? "text-primary-900" : "text-gray-900",
                        "ml-3 font-medium"
                      )}
                    >
                      {plan.name}
                    </RadioGroup.Label>
                    {orgDetails?.organization.planType === plan.planType &&
                      (orgDetails?.organization.planType === "FREE" ||
                        orgDetails?.organization.billingCycle ===
                          (enabled ? "YEARLY" : "MONTHLY")) && (
                        <span className="ml-3 inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                          Current Plan
                        </span>
                      )}
                  </span>
                  <RadioGroup.Description
                    as="span"
                    className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center"
                  >
                    <span
                      className={classNames(
                        checked ? "text-primary-900" : "text-gray-900",
                        "font-medium"
                      )}
                    >
                      {plan.name === "Free Plan" ? (
                        "Free"
                      ) : (
                        <>
                          {!enabled ? (
                            `$${plan.priceMonthly}/month`
                          ) : (
                            <span>${plan.priceYearly}/year </span>
                          )}
                        </>
                      )}
                    </span>{" "}
                  </RadioGroup.Description>
                  <RadioGroup.Description
                    as="span"
                    className={classNames(
                      checked ? "text-primary-700" : "text-gray-500",
                      "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right"
                    )}
                  >
                    {`Parsing and formatting: ${
                      enabled
                        ? plan.availableCredits.yearly
                        : plan.availableCredits.monthly
                    }/month`}{" "}
                    {/* Modify this line */}
                  </RadioGroup.Description>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
        {selectedPlan && (
          <div className="flex justify-end mt-3">
            {orgDetails?.organization.planType !== selectedPlan.planType && (
              <SpinnerButton
                loading={isLoading}
                disabled={isLoading}
                onClick={() =>
                  handleSpinnerClick({
                    selectedPlan,
                    enabled,
                    profile,
                    organization,
                    orgDetails,
                  })
                }
                type="button"
                className={`${buttonClass} z-10 focus-visible:outline-primary flex  justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
              >
                {action}
              </SpinnerButton>
            )}
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default SubscriptionPlans;
