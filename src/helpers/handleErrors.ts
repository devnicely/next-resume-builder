import { TRPCClientError } from "@trpc/client";
import { handleTRPCError } from "~/server/errors/handleTRPCError";

const handleErrors = (
  error: unknown,
  setErrors: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (error instanceof TRPCClientError) {
    const message = handleTRPCError(error);
    setErrors((prevErrors) => [...prevErrors, message]);
  } else {
    setErrors((prevErrors) => [...prevErrors, "An unknown error occurred"]);
  }
};

export default handleErrors;
