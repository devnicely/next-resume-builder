import { handleRedirection } from "middleware";
import Link from "next/link";
import React, { useState, type FC } from "react";
import Layout from "./layout";
import logo from "../../../public/assets/logo.png";
import Image from "next/image";
import useLogin from "~/hooks/useLogin";
import { api } from "~/utils/api";
import SpinnerButton from "~/components/common/SpinnerButton";
import { notify } from "~/components/ReactHotToast";
import { handleTRPCError } from "~/server/errors/handleTRPCError";
import ErrorAlert from "~/components/common/ErrorAlert";
import { type GetServerSideProps } from "next";

type ForgotPwProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("UNPROTECTED")(ctx);
};
const ForgotPw: FC<ForgotPwProps> = () => {
  const { errors, setErrors } = useLogin();
  const [email, setEmail] = useState("");
  const onChange = (e) => {
    setErrors([]);
    setEmail(e.target.value);
  };

  const {
    mutateAsync: forgotPassword,
    isLoading,
    isError,
  } = api.authentication.forgotPassword.useMutation();

  const sendForgotPwEmail = async () => {
    try {
      setErrors([]);
      await forgotPassword({
        email,
      }).then((data) => notify({ message: data.message }));
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
            Forgot Password
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
                  onChange={onChange}
                  value={email}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <ErrorAlert errors={errors} />
            <div>
              <SpinnerButton
                onClick={() => sendForgotPwEmail()}
                loading={isLoading}
                disabled={isLoading}
                type="submit"
                className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                {isLoading ? "Sending reset email" : "Send reset email"}
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

export default ForgotPw;
