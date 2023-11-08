import React, { useState, useEffect } from "react";
import BillingHistory from "~/components/billing-details/BillingHistory";
import UserLayout from "~/components/layout/UserLayout";
import CurrentPlanAndCreditCard from "~/components/billing-details/CurrentPlanAndCreditCard";
import Footer from "~/components/layout/Footer";
import { handleRedirection } from "middleware";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Confetti from "react-confetti";
import SuccessModal from "~/components/common/SuccessModal";
import LoadingSpinner from "~/components/common/LoadingSpinner";
import { useBillingPlansStore } from "~/store/useBillingPlansStore";
import { useUserProfile } from "~/context/UserProfileContext";
import SubscriptionPlans from "~/components/billing-details/SubscriptionPlans";
import { SUBSCRIPTIONPLANS } from "~/server/config/subscriptionPlans";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("PROTECTED")(ctx);
};

const payments = [
  {
    id: 1,
    date: "1/1/2020",
    datetime: "2020-01-01",
    description: "Business Plan - Annual Billing",
    amount: "CA$109.00",
    href: "#",
  },
  // More payments...
];

const BillingPlans = () => {
  const { organization: orgDetails } = useUserProfile()!;

  const [selectedPlan, setSelectedPlan] = useState(null);

  const {
    customIsLoading,
    showModal,
    showConfetti,
    setCustomIsLoading,
    setShowModal,
    setShowConfetti,
  } = useBillingPlansStore();

  const router = useRouter();
  const { session_id: sessionId, organizationId } = router.query;
  console.log("organization:", orgDetails);

  const { data, isSuccess, isError, refetch } =
    api.stripe.queryUnacknowledgedPayments.useQuery(
      { organizationId: organizationId },
      { enabled: !!sessionId && !!organizationId }
    );

  const { data: queryBillingPayments } =
    api.stripe.queryBillingPayments.useQuery(
      { organizationId: orgDetails?.organization.id },
      { enabled: !!orgDetails?.organization.id }
    );

  useEffect(() => {
    if (organizationId && sessionId) {
      setCustomIsLoading(true);
      refetch();
    } else {
      setCustomIsLoading(false);
    }
  }, [organizationId, sessionId, refetch]);

  useEffect(() => {
    if (isSuccess) {
      setCustomIsLoading(false);
      const alreadyShown = sessionStorage.getItem(
        "modalShownForSession:" + sessionId
      );
      if (!alreadyShown) {
        setShowModal(true);
        setShowConfetti(true);
        sessionStorage.setItem("modalShownForSession:" + sessionId, "true");
      }
    }
    if (isError) {
      setCustomIsLoading(false);
    }
  }, [isSuccess, isError, sessionId]);

  const handleCloseModal = () => {
    setShowModal(false);
    setShowConfetti(false);
  };
  return (
    <UserLayout
      title={"Billing & plans"}
      subtitle={
        "Manage your organization’s billing & subscription information "
      }
    >
      {customIsLoading && !data && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <span>Please be patient...</span>
          <LoadingSpinner />
        </div>
      )}
      <div className="flex-1 relative">
        {showConfetti && <Confetti width={1000} height={1000} />}
        {isSuccess && (
          <SuccessModal
            showModal={showModal}
            setShowModal={setShowModal}
            handleCloseModal={handleCloseModal}
          />
        )}
        <div className="z-10">
          <CurrentPlanAndCreditCard
            queryBillingPayments={queryBillingPayments}
            orgDetails={orgDetails}
          />
        </div>
        <div className="mt-12 z-10">
          <SubscriptionPlans
            orgDetails={orgDetails}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            plans={SUBSCRIPTIONPLANS}
          />
        </div>
        <div className="h-[45px]" />
        <BillingHistory
          queryBillingPayments={queryBillingPayments}
          payments={payments}
        />
      </div>
      <Footer />
    </UserLayout>
  );
};

export default BillingPlans;
