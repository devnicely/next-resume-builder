import clsx from "clsx";
import { type FC, type PropsWithChildren } from "react";

type SpinnerButtonProps = PropsWithChildren & {
  className?: string;
  loadingClassName?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
};

const SpinnerButton: FC<SpinnerButtonProps> = ({
  className,
  children,
  disabled,
  loading,
  type,
  onClick,
}) => {
  const appliedClassName = clsx(className, {
    "bg-primary-200": loading,
    "bg-primary-600": !loading,
  });

  return (
    <button
      className={appliedClassName}
      type={type}
      disabled={disabled ? true : false}
      onClick={onClick}
    >
      {children}
      <svg
        className={clsx(
          loading ? "-mr-1 ml-3 h-5 w-5 animate-spin text-white" : "hidden"
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </button>
  );
};

export default SpinnerButton;
