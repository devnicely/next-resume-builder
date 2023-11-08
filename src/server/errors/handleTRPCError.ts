interface TRPCClientError {
  code?: string;
  message: string;
}

export function handleTRPCError(error: TRPCClientError): string {
  const code = error.code ?? "BAD_REQUEST";
  const message = error.message;
  return getErrorMessageForCode(code, message);
}

function getErrorMessageForCode(code: string, defaultMsg: string): string {
  switch (code) {
    case "INTERNAL_SERVER_ERROR":
      return "An internal server error occurred. Please try again.";
    case "NOT_FOUND":
      return "Resource not found.";
    case "BAD_REQUEST":
      return defaultMsg;
    case "CONFLICT":
      return "A conflict occurred, please resolve it.";
    case "TOO_MANY_REQUESTS":
      return "You have reached the maximum number of allowed requests.";
    default:
      return defaultMsg;
  }
}
