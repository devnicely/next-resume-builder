import { XCircle, CheckCircle2 } from "lucide-react";
import { useEffect, type Dispatch } from "react";

type PasswordValidationProps = {
  password: string;
  setIsPasswordValid: Dispatch<React.SetStateAction<boolean>>;
};

const PasswordValidation: React.FC<PasswordValidationProps> = ({
  password,
  setIsPasswordValid,
}) => {
  const hasCapitalLetter = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
    password
  );
  const hasEightChars = password?.length >= 8;

  const isPasswordValid =
    hasCapitalLetter && hasNumber && hasSpecialChar && hasEightChars;

  useEffect(() => {
    setIsPasswordValid(isPasswordValid); // update state
  }, [isPasswordValid]);

  const checkIcon = (
    <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
  );
  const crossIcon = (
    <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
  );

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="font-medium text-red-800 text-xs">
            Password must meet the following requirements:
          </h3>
          <div className="mt-2 text-xs text-red-700">
            <ul role="list" className="list-disc space-y-2 ">
              <li className="flex items-center">
                {hasEightChars ? checkIcon : crossIcon} At least 8 characters
              </li>
              <li className="flex items-center">
                {hasCapitalLetter ? checkIcon : crossIcon} At least one capital
                letter
              </li>
              <li className="flex items-center">
                {hasNumber ? checkIcon : crossIcon} At least one number
              </li>
              <li className="flex items-center">
                {hasSpecialChar ? checkIcon : crossIcon} At least one special
                character
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordValidation;
