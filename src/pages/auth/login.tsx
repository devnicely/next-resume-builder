import { handleRedirection } from "middleware";
import { type GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, type FC } from "react";
import ErrorAlert from "~/components/common/ErrorAlert";
import SpinnerButton from "~/components/common/SpinnerButton";
import useLogin from "~/hooks/useLogin";

import Layout from "./layout";
import Image from "next/image";
import logo from "../../../public/assets/logo.png";
import { loginUserSchema, Login } from "~/validation/auth";

type LoginProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("UNPROTECTED")(ctx);
};

const Login: FC<LoginProps> = () => {
  const { errors, setErrors, onChange, loginData, isLoading, setIsLoading } =
    useLogin();
  const router = useRouter();

  const onSubmit = useCallback(async (data: Login) => {
    try {
      setIsLoading(true);

      const validationResult = loginUserSchema.safeParse(data);

      if (validationResult.success) {
        const result = await signIn("credentials", {
          ...validationResult.data,
          redirect: false,
        });

        if (result?.error) {
          setErrors(["Either email or password is wrong"]);
        } else {
          await router.push("/user/dashboard");
        }
      } else {
        setErrors(["Validation failed: " + validationResult.error.message]);
      }
    } catch (err) {
      console.error(err);
      setErrors(["Internal server error"]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Layout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image className="mx-auto h-24 w-auto" src={logo} alt="Prospect ai" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign in to continue
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                  autoComplete="email"
                  onChange={onChange}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Password
                </label>
                <div className="text-sm  ">
                  <Link
                    href={"/auth/forgot-password"}
                    className="text-whie  font-semibold text-white hover:text-primary-300"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={onChange}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <ErrorAlert errors={errors} />
            <div>
              <SpinnerButton
                loading={isLoading}
                disabled={isLoading}
                onClick={() => onSubmit(loginData)}
                type="submit"
                className="hover:bg-primary focus-visible:outline-primary flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {isLoading ? "Signing you in" : "Sign in"}
              </SpinnerButton>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-400">
            Not a member?{" "}
            <Link
              href={"/auth/register"}
              className="font-semibold leading-6 text-primary-400 hover:text-primary-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
