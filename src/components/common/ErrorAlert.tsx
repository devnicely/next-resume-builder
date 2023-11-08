import { X } from "lucide-react";
import { type TRPCError } from "@trpc/server";
import { type FC } from "react";

type ErrorAlertProps = {
  errors: (string | TRPCError)[];
};

function errorToString(error: string | TRPCError): string {
  if (typeof error === "string") {
    return error;
  }
  // Custom logic to convert TRPCError to string
  return error.message;
}

const ErrorAlert: FC<ErrorAlertProps> = ({ errors }) => {
  if (errors?.length <= 0) {
    return null;
  }

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <X className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            There was an error with your submission
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc space-y-1 pl-5">
              {errors &&
                errors.length > 0 &&
                errors?.map((error, index) => (
                  <li key={index}>{errorToString(error)}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
