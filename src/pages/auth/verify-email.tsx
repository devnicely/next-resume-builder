import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { api } from "~/utils/api";
import { handleRedirection } from "middleware";
import { handleTRPCError } from "~/server/errors/handleTRPCError";
import { notify } from "~/components/ReactHotToast";
import SpinnerButton from "~/components/common/SpinnerButton";
import { type GetServerSideProps } from "next";
import LoadingScreen from "~/components/LoadingScreen";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("UNPROTECTED")(ctx);
};

const VerifyEmail = () => {
  const router = useRouter();
  const { token, email } = router.query as { token?: string; email?: string };
  const [statusMessage, setStatusMessage] = useState<string>(
    "Verifying your email..."
  );
  const { mutateAsync: verifyEmail, isError } =
    api.authentication.verifyEmail.useMutation();

  const { mutateAsync: createOrganization } =
    api.organization.createOrganization.useMutation();

  const { mutateAsync: resendVerificationEmail, isLoading: isResendLoading } =
    api.authentication.resendVerificationEmail.useMutation();

  const handleResendEmail = async () => {
    try {
      // setErrors([]);
      await resendVerificationEmail({
        email: email!,
      }).then((data) => notify({ message: data.message }));
    } catch (error) {
      const message = handleTRPCError(error);
      // setErrors((prevErrors) => [...prevErrors, message]);
    }
  };

  async function verify() {
    try {
      setStatusMessage("Starting email verification...");

      if (!token || !email) {
        setStatusMessage("Invalid token or email.");
        return;
      }

      setStatusMessage("Verifying email...");
      const response = await verifyEmail({ token, email });

      if (response?.loginToken) {
        setStatusMessage(
          "Email successfully verified...Setting up your organization..."
        );

        const createOrgResponse = await createOrganization({
          userId: response.response?.id,
          orgName: response.response.tempOrgName!,
        });

        if (createOrgResponse.success) {
          setStatusMessage(
            "Organization created successfully...Signing you in..."
          );

          const signInResult = await signIn("credentials", {
            email,
            loginToken: response.loginToken,
            redirect: false,
          });

          if (signInResult?.error) {
            setStatusMessage("Failed to sign in automatically... reattempting");
          } else {
            setStatusMessage("Redirecting you to your dashboard...");
            await router.push("/user/dashboard");
          }
        } else {
          setStatusMessage("Failed to create organization.");
        }
      } else {
        setStatusMessage("Failed to obtain login token from server.");
      }
    } catch (error) {
      const message = handleTRPCError(error);
      setStatusMessage(message);
      console.log("error", error);
    }
  }

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      verify().catch((error) => {
        console.error("An unexpected error occurred:", error);
      });
      hasRun.current = true;
    }
  }, [token, email]);

  return (
    <div>
      <LoadingScreen
        isError={isError}
        token={token}
        email={email}
        statusMessage={statusMessage}
        isResendLoading={isResendLoading}
        handleResendEmail={handleResendEmail}
      />
    </div>
  );
};

export default VerifyEmail;
