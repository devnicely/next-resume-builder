import { useEffect, useState } from "react";
import logo from "../../../public/assets/logo.png";
import Image from "next/image";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { handleRedirection } from "middleware";
import { handleTRPCError } from "~/server/errors/handleTRPCError";
import { type GetServerSideProps } from "next";
import LoadingScreen from "~/components/LoadingScreen";
import Stepper from "~/components/accept-invite/Stepper";
import { AccountDetails } from "~/components/account/AccountDetails";
import { AccountSecurity } from "~/components/account/AccountSecurity";
import { signIn } from "next-auth/react";

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   return handleRedirection("UNPROTECTED")(ctx);
// };

const AcceptInvite = () => {
  const steps = [
    {
      id: "Step 1",
      name: "Account Details",
      component: AccountDetails,
      status: "complete",
    },
    {
      id: "Step 2",
      name: "Account Security",
      component: AccountSecurity,
      status: "current",
    },
  ];

  const [activeStep, setActiveStep] = useState<string>("Step 1");
  const changeActiveStep = (newStep: string) => {
    setActiveStep(newStep);
  };

  const ActiveComponent = steps.find(
    (step) => step.id === activeStep
  )?.component;

  const {
    mutateAsync: acceptInvitation,
    isSuccess,
    isError,
    isLoading: isInviteLoading,
  } = api.team.acceptInvite.useMutation();

  const [statusMessage, setStatusMessage] = useState("");
  const isInvite = true;
  const router = useRouter();

  const { token, email, orgId } = router.query;

  async function accept() {
    try {
      setStatusMessage("Starting verification...");

      if (!token || !email || !orgId) {
        setStatusMessage("Invalid token or email");
        return;
      }

      setStatusMessage("Verifying your information...");
      const response = await acceptInvitation({ email, token, orgId });
      // console.log("responseresponse", response);
      if (response.success) {
        setStatusMessage(response.message);
        await signIn("credentials", {
          email: email,
          loginToken: token,
          redirect: false,
        });
      }
    } catch (error) {
      const message = handleTRPCError(error);
      setStatusMessage(message);
      console.log("error", error);
    }
  }

  useEffect(() => {
    accept().catch((error) => {
      console.error("An unexpected error occurred:", error);
    });
  }, [token, email]);

  return (
    <div className="bg-slate-50">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center min-h-full px-6 py-5 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              className="mx-auto h-20 w-auto"
              src={logo}
              alt="Prospect ai"
            />
          </div>
          <div className="w-3/5 mt-5 rounded-lg ">
            <Stepper
              steps={steps.map((step) => ({
                ...step,
                status:
                  step.id === activeStep
                    ? "current"
                    : step.id < activeStep
                    ? "complete"
                    : "inactive",
              }))}
            />

            <div className="bg-white rounded-lg ">
              {ActiveComponent && (
                <ActiveComponent
                  isInvite={isInvite}
                  changeActiveStep={changeActiveStep}
                  token={token}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <LoadingScreen
          isError={isError}
          token={token}
          email={email}
          statusMessage={statusMessage}
          isResendLoading={isInviteLoading}
        />
      )}
    </div>
  );
};

export default AcceptInvite;
