import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useCallback, type FC, useRef } from "react";
import PasswordValidation from "~/components/authentication/PasswordValidation";
import SpinnerButton from "~/components/common/SpinnerButton";
import Layout from "./layout";
import logo from "../../../public/assets/logo.png";
import Image from "next/image";
import useRegister from "~/hooks/useRegister";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { handleRedirection } from "middleware";
import SuccessAlert from "~/components/common/SuccessAlert";
import ErrorAlert from "~/components/common/ErrorAlert";
import { type GetServerSideProps } from "next";
import { notify } from "~/components/ReactHotToast";
import { Register } from "~/validation/auth";
import handleErrors from "~/helpers/handleErrors";

type RegisterProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("UNPROTECTED")(ctx);
};
const Register: FC<RegisterProps> = () => {
  const {
    errors,
    setErrors,
    onChange,
    registerData,
    setRegisterData,
    setIsPasswordFocused,
    isPasswordFocused,
    togglePasswordVisibility,
    showPassword,
    successMsg,
    setSuccessMsg,
    setIsPasswordValid,
    isPasswordValid,
  } = useRegister();

  const router = useRouter();
  const lastRegisteredEmailRef = useRef("");

  const {
    mutateAsync: signup,
    isLoading,
    isSuccess,
  } = api.authentication.signup.useMutation();

  
  const onSubmit = useCallback(
    async (data: Register) => {
      const errors = [];

      if (!data.password) {
        errors.push("Password must be filled");
      }

      if (!data.confirmPassword) {
        errors.push("Confirm Password must be filled");
      }

      if (!data.email) {
        errors.push("Email must be filled");
      }

      if (
        data.password &&
        data.confirmPassword &&
        data.password !== data.confirmPassword
      ) {
        errors.push("Password and Confirm Password must match");
      }

      if (errors.length > 0) {
        setErrors(errors);
        return;
      }

      try {
        setErrors([]);
        const result = await signup(data);

        if (result && result.status === 201) {
          lastRegisteredEmailRef.current = data.email;
          setRegisterData({
            email: "",
            password: "",
            confirmPassword: "",
            tempOrgName: "",
          });

          if (result?.message) {
            setSuccessMsg([result.message]);
          }
        }
      } catch (error) {
        handleErrors(error, setErrors);
      }
    },
    [signup, router]
  );

  const { mutateAsync: resendVerificationEmail, isLoading: isResendLoading } =
    api.authentication.resendVerificationEmail.useMutation();

  const handleResendEmail = async () => {
    try {
      setErrors([]);
      await resendVerificationEmail({
        email: lastRegisteredEmailRef.current,
      }).then((data) => notify({ message: data.message }));
    } catch (error) {
      handleErrors(error, setErrors);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image className="mx-auto h-24 w-auto" src={logo} alt="Prospect ai" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Register for free
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label
                htmlFor="tempOrgName"
                className="block text-sm font-medium leading-6 text-white"
              >
                Organization name
              </label>
            </div>
            <div className="mt-2">
              <input
                id="tempOrgName"
                value={registerData.tempOrgName}
                name="tempOrgName"
                type="text"
                autoComplete="off"
                onChange={onChange}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                Work email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={registerData.email}
                  autoComplete="off"
                  onChange={onChange}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium leading-6 text-white"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  id="firstName"
                  name="firstName"
                  type="firstName"
                  value={registerData.firstName}
                  autoComplete="off"
                  onChange={onChange}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Password
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  value={registerData.password}
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
                    password={registerData.password}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  value={registerData.confirmPassword}
                  name="confirmPassword"
                  type="password"
                  autoComplete="off"
                  onChange={onChange}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <ErrorAlert errors={errors} />
            {isSuccess && successMsg.length ? (
              <SuccessAlert
                loading={isResendLoading}
                success={[successMsg, "Resend email"].flat()}
                resendVerificationEmail={() => {
                  handleResendEmail().catch((error) => {
                    console.error("Failed to resend email:", error);
                  });
                }}
              />
            ) : (
              ""
            )}
            <div>
              <SpinnerButton
                loading={isLoading}
                disabled={isLoading || !isPasswordValid}
                onClick={() => {
                  onSubmit(registerData).catch((error) => {
                    console.error("An error occurred:", error);
                  });
                }}
                type="submit"
                className="hover:bg-primary focus-visible:outline-primary flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {isLoading ? "Registering..." : "Register"}
              </SpinnerButton>
            </div>
          </div>
          <p className="mt-10 text-center text-sm text-gray-400">
            Already member?{" "}
            <Link
              href={"/auth/login"}
              className="hover:text-primary font-semibold leading-6 text-primary-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
