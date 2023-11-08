import clsx from "clsx";
import { type FC } from "react";

type SuccessAlertProps = {
  success: string[];
  resendVerificationEmail?: () => void;
  loading: boolean;
};

const SuccessAlert: FC<SuccessAlertProps> = ({
  success,
  resendVerificationEmail,
  loading,
}) => {
  if (success.length <= 0) {
    return null;
  }

  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="text-sm text-green-800">
        <ul role="list" className="list-disc space-y-1 pl-5">
          {success?.map((successText, index) => (
            <li key={index}>
              {successText === "Resend email" ? (
                <span
                  className={clsx("cursor-pointer text-blue-600", {
                    "hover:underline": !loading,
                  })}
                  onClick={() => {
                    if (resendVerificationEmail && !loading) {
                      resendVerificationEmail();
                    }
                  }}
                >
                  {loading ? (
                    <span className="text-green-800">Resending email...</span>
                  ) : (
                    successText
                  )}
                </span>
              ) : (
                successText
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuccessAlert;
