import { useRouter } from "next/router";
import React, { type FC } from "react";
import SpinnerButton from "./common/SpinnerButton";
import { Button } from "./common/button";

interface LoadingScreenProps {
  isError: boolean;
  token: string | null;
  email: string | null;
  statusMessage: string;
  isResendLoading: boolean;
  handleResendEmail?: () => void;
}

const LoadingScreen: FC<LoadingScreenProps> = ({
  isError,
  token,
  email,
  statusMessage,
  isResendLoading,
  handleResendEmail,
}) => {
  const router = useRouter();

  return (
    <>
      <style>{`
        .loader {
          border-top-color: #33828D;
          animation: spinner 1.5s linear infinite;
        }
        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-primary-700">
        {!(isError || !token || !email) && (
          <div className="loader mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
        )}
        <p className="mb-5 text-center text-lg font-semibold text-white">
          {statusMessage}
        </p>
        {isError &&
          statusMessage === "Invalid or expired verification token" && (
            <SpinnerButton
              loading={isResendLoading}
              disabled={isResendLoading}
              className="flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              onClick={handleResendEmail}
            >
              {`${isResendLoading ? "Resending" : "Resend"} verification email`}
            </SpinnerButton>
          )}
        {isError &&
          (statusMessage === "Email already verified" ||
            statusMessage === "User not found") && (
            <Button
              customClass="flex justify-center rounded-md bg-primary-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
          )}
      </div>
    </>
  );
};

export default LoadingScreen;
