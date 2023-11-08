import { RadioGroup } from "@headlessui/react";
import { useEffect, useState } from "react";
import masterCardIcon from "../../../public/assets/mastercard.png";
import visaIcon from "../../../public/assets/visa.png";
import Image from "next/image";
import { api } from "~/utils/api";
import { useUserProfile } from "~/context/UserProfileContext";
import { classNames } from "../common/Classnames";
import UsageBar from "./UsageBar";
import LoadingSpinner from "../common/LoadingSpinner";
import moment from "moment";
import AdditionalCreditsModal from "../common/AdditionalCreditsModal";
import capitalizeFirstLetter from "~/helpers/capitalizeFirstLetter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../common/Tooltip";
import { HelpCircle } from "lucide-react";
import { Button } from "../common/button";

const CurrentPlanAndCreditCard = ({ queryBillingPayments }) => {
  const [inputValue, setInputValue] = useState("1");
  const [totalPrice, setTotalPrice] = useState(12);

  const formattedStartDate = moment(
    queryBillingPayments?.latestBilling?.subscriptionStartDate
  ).format("DD/MM/YYYY");
  const formattedEndDate = moment(
    queryBillingPayments?.latestBilling?.subscriptionEndDate
  ).format("DD/MM/YYYY");
  const [isFirstOptionSelected, setIsFirstOptionSelected] = useState(true);
  const [showUsage, setShowUsage] = useState(false);
  const [open, setOpen] = useState(false);
  const { profile, organization, isOrgLoading } = useUserProfile()!;
  const toggleUsage = () => {
    if (isFirstOptionSelected) {
      setShowUsage(!showUsage);
    }
  };

  const {
    mutateAsync: purchaseAdditionalCredits,
    isLoading: isCreditLoading,
    data: purchaseAdditionalCreditsLink,
  } = api.stripe.purchaseAdditionalCredits.useMutation();

  const {
    mutateAsync: createStripePortalSession,
    isLoading,
    data,
  } = api.stripe.createStripePortalSession.useMutation();

  useEffect(() => {
    if (data ?? data?.url) {
      window.location.href = data.url;
    }
  }, [data]);

  useEffect(() => {
    if (purchaseAdditionalCreditsLink ?? purchaseAdditionalCreditsLink?.url) {
      window.location.href = purchaseAdditionalCreditsLink.url;
    }
  }, [purchaseAdditionalCreditsLink]);

  const buyCredits = async () => {
    const totalPriceNumeric = parseFloat(totalPrice);
    const inputValueNumeric = parseFloat(inputValue);

    if (!isNaN(totalPriceNumeric) && !isNaN(inputValueNumeric)) {
      await purchaseAdditionalCredits({
        organizationId: organization?.organization.id,
        numberOfCredits: (inputValueNumeric * 100).toString(),
        totalPrice: (totalPriceNumeric * 100).toString(),
        userId: profile?.user?.id,
      });
    } else {
      console.error(
        "Error: totalPrice and/or inputValue is not a valid number."
      );
    }
  };

  const availableCredits = organization?.organization.availableCredits;
  const usedAvailableCredits = organization?.organization.usedAvailableCredits;

  const additionalCredits = organization?.organization.additionalCredits;
  const usedAdditionalCredits =
    organization?.organization.usedAdditionalCredits;

  const calculateUsagePercentage = (used, max) => {
    return max ? (used / max) * 100 : 0;
  };

  return (
    <div className="mt-5">
      <AdditionalCreditsModal
        open={open}
        setOpen={setOpen}
        func={buyCredits}
        inputValue={inputValue}
        setInputValue={setInputValue}
        totalPrice={totalPrice}
        setTotalPrice={setTotalPrice}
        isCreditLoading={isCreditLoading}
      />
      <RadioGroup
        value={isFirstOptionSelected}
        onChange={setIsFirstOptionSelected}
      >
        <RadioGroup.Label className="sr-only">Pricing plans</RadioGroup.Label>
        <div className="relative -space-y-px rounded-md bg-white">
          <RadioGroup.Option
            value={"currentsub"}
            className={({ checked }) =>
              classNames(
                "rounded-tl-md rounded-tr-md",
                checked
                  ? "z-5 border-primary-200 bg-primary-50"
                  : "border-gray-200",
                "relative flex cursor-pointer flex-col border p-2 focus:outline-none"
              )
            }
          >
            {({ active, checked }) => (
              <>
                <div className="flex items-center justify-between">
                  <span className="w-1/5 pr-2 text-sm font-medium">
                    Current Subscription
                  </span>
                  <span className="flex w-3/5 items-center justify-start text-sm">
                    <span
                      className="flex-grow text-center"
                      style={{ lineHeight: "1.5" }}
                    >
                      {organization?.organization.planType === "FREE" ? (
                        "Free Plan"
                      ) : (
                        <>
                          {capitalizeFirstLetter(
                            queryBillingPayments?.latestBilling?.planType
                          )}{" "}
                          Plan ({formattedStartDate} - {formattedEndDate})
                        </>
                      )}
                    </span>
                  </span>
                  <Button
                    onClick={toggleUsage}
                    type="button"
                    className="w-1/5 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <span className="hidden sm:inline">View Usage</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                </div>
              </>
            )}
          </RadioGroup.Option>
          {showUsage && isFirstOptionSelected && (
            <div className="bg-gray-100 p-4 h-36">
              <span className="text-gray-500 text-sm">
                Subscription usage ({usedAvailableCredits} / {availableCredits})
              </span>
              <UsageBar
                usagePercentage={calculateUsagePercentage(
                  usedAvailableCredits,
                  availableCredits
                )}
              />
              <div className=" my-4" />
              <span className="text-gray-500 text-sm">
                Credit usage ({usedAdditionalCredits} / {additionalCredits})
              </span>
              <UsageBar
                usagePercentage={calculateUsagePercentage(
                  usedAdditionalCredits,
                  additionalCredits
                )}
              />
            </div>
          )}
          <RadioGroup.Option
            value={"extraCredits"}
            className={({ checked }) =>
              classNames(
                checked
                  ? "z-5 border-primary-200 bg-primary-50 "
                  : "border-gray-200",
                "relative flex cursor-pointer flex-col border p-2 focus:outline-none "
              )
            }
          >
            {({ active, checked }) => (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex gap-7">
                    <span className="w-1/5 pr-2 text-sm font-medium flex">
                      Credits{" "}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-primary-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-normal">
                            Each credit represents the parsing and <br />
                            formatting of a single resume
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="flex w-3/5 items-center justify-start text-sm">
                    <span
                      className="flex-grow text-center"
                      style={{ lineHeight: "1.5" }}
                    >
                      {organization?.organization.additionalCredits +
                        organization?.organization.availableCredits}{" "}
                      total credits
                    </span>
                  </span>
                  <Button
                    onClick={() => setOpen(true)}
                    type="button"
                    className="w-1/5 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <span className="hidden sm:inline">Add credits</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
              </>
            )}
          </RadioGroup.Option>
          {organization?.organization.planType === "FREE" ? null : (
            <RadioGroup.Option
              value={"creditCard"}
              className={({ checked }) =>
                classNames(
                  "rounded-bl-md rounded-br-md",
                  checked
                    ? "z-5 border-primary-200 bg-primary-50"
                    : "border-gray-200",
                  "relative flex cursor-pointer flex-col border p-2 focus:outline-none"
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex items-center justify-between ">
                    <span className="w-1/5 pr-2 text-sm font-medium">
                      Credit Card
                    </span>
                    <span className="flex w-3/5 items-center justify-start text-sm">
                      <span
                        className="flex-grow text-center"
                        style={{ lineHeight: "1.5" }}
                      >
                        <div className="flex items-center justify-center gap-3 ">
                          {queryBillingPayments?.latestBilling?.cardBrand ===
                          "visa" ? (
                            <Image
                              src={visaIcon}
                              alt="payIcon"
                              className="h-10 w-10"
                            />
                          ) : (
                            <Image
                              src={masterCardIcon}
                              alt="payIcon"
                              className="h-10 w-10"
                            />
                          )}
                          ending in {queryBillingPayments?.latestBilling?.last4}
                        </div>
                      </span>
                    </span>
                    <Button
                      onClick={() =>
                        isOrgLoading
                          ? null
                          : createStripePortalSession({
                              organizationId: organization?.organization.id,
                              userId: profile?.user.id,
                              planType: organization?.organization.planType,
                            })
                      }
                      loading={isLoading}
                      disabled={isLoading}
                      type="button"
                      className=" w-1/5 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      {isOrgLoading ? (
                        <span className="flex justify-center items-center">
                          <LoadingSpinner />
                        </span>
                      ) : (
                        "Manage Plan"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

export default CurrentPlanAndCreditCard;
