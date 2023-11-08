import Link from "next/link";
import { useState } from "react";
import PasswordValidation from "~/components/authentication/PasswordValidation";
import SpinnerButton from "~/components/common/SpinnerButton";
import logo from "../../../public/assets/logo.png";
import Image from "next/image";
import useRegister from "~/hooks/useRegister";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { handleRedirection } from "middleware";
import Layout from "./layout";
import { handleTRPCError } from "~/server/errors/handleTRPCError";
import SuccessAlert from "~/components/common/SuccessAlert";
import ErrorAlert from "~/components/common/ErrorAlert";
import { type GetServerSideProps } from "next";
import { Eye, EyeOff } from "lucide-react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("UNPROTECTED")(ctx);
};

const ResetPw = () => {
  const [newPassword, setNewPassword] = useState("");
  const onChange = (e) => {
    setErrors([]);
    setNewPassword(e.target.value);
  };
  const {
    errors,
    setErrors,
    setIsPasswordFocused,
    isPasswordFocused,
    togglePasswordVisibility,
    showPassword,
    successMsg,
    setSuccessMsg,
    setIsPasswordValid,
  } = useRegister();
  const router = useRouter();
  const { token } = router.query;

  const {
    mutateAsync: userSetNewPassword,
    isLoading,
    isSuccess,
  } = api.authentication.userSetNewPassword.useMutation();

  const userCreatesNewPw = async () => {
    try {
      setErrors([]);
      await userSetNewPassword({
        token,
        newPassword,
      }).then((data) => setSuccessMsg([data.message]));
    } catch (error) {
      const message = handleTRPCError(error);
      setErrors((prevErrors) => [...prevErrors, message]);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image className="mx-auto h-24 w-auto" src={logo} alt="Prospect ai" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Reset your password
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                New Password
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  autoComplete="off"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                />
                <div
                  onClick={() => togglePasswordVisibility()}
                  className=" absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <Eye
                      className="h-5 w-5 cursor-pointer text-gray-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeOff
                      className="h-5 w-5 cursor-pointer text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
                {/* PASSWORD MEETS REQS */}
                <div
                  className={`absolute mt-3 transition duration-300 ease-in-out ${
                    isPasswordFocused ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ pointerEvents: isPasswordFocused ? "auto" : "none" }}
                >
                  <PasswordValidation
                    setIsPasswordValid={setIsPasswordValid}
                    password={newPassword}
                  />
                </div>
              </div>
            </div>
            {isSuccess && successMsg.length ? (
              <SuccessAlert
                loading={isLoading}
                success={[successMsg].flat()}
                // resendVerificationEmail={() => {
                //   handleResendEmail().catch((error) => {
                //     console.error("Failed to resend email:", error);
                //   });
                // }}
              />
            ) : (
              ""
            )}
            <ErrorAlert errors={errors} />
            <div>
              <SpinnerButton
                onClick={() => userCreatesNewPw()}
                loading={isLoading}
                disabled={isLoading}
                type="submit"
                className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                Reset Password
              </SpinnerButton>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-400">
            Password remembered?
            <Link
              href={"/auth/login"}
              className="font-semibold leading-6 text-primary-400 hover:text-primary-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPw;
