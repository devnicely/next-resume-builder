import React, { Fragment, useEffect, useState } from "react";
import Footer from "~/components/layout/Footer";
import UserLayout from "~/components/layout/UserLayout";
import { AccountDetails } from "~/components/account/AccountDetails";
import { AccountSecurity } from "~/components/account/AccountSecurity";
import { handleRedirection } from "middleware";
import { type GetServerSideProps } from "next";
import { useUserProfile } from "~/context/UserProfileContext";
import FullPageLoader from "~/components/LoadingScreen";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { notify, notifyError } from "~/components/ReactHotToast";
import { Button } from "~/components/common/button";
import moment from "moment";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("PROTECTED")(ctx);
};

const Account = () => {
  const { profile, refetchProfile } = useUserProfile()!;

  const { mutateAsync: verifyEmail } =
    api.authentication.verifyEmail.useMutation();

  const [activeTab, setActiveTab] = useState<string>("Account");

  const router = useRouter();

  const { token, email } = router.query as { token?: string; email?: string };

  useEffect(() => {
    const verifyAndNotify = async () => {
      try {
        if (token && email) {
          await verifyEmail({ token, email })
            .then(() => {
              notify({ message: "Email verified" });
              void refetchProfile();
            })
            .catch(() => notifyError({ message: "An error has occured" }));
        }
      } catch (error) {
        // Handle any errors that occurred during verification
        console.error("Error verifying email:", error);
      }
    };

    void verifyAndNotify();
  }, [token, email]);

  return (
    <UserLayout>
      <div className="flex-1">
        <header className="border-b border-white/5">
          <nav className="flex overflow-x-auto py-4">
            <ul
              role="list"
              className="sm:text-md flex min-w-full flex-none gap-x-6  text-sm font-semibold leading-6 text-gray-400 "
            >
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("Account");
                  }}
                  className={activeTab === "Account" ? "text-primary-400" : ""}
                >
                  Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("Security");
                  }}
                  className={activeTab === "Security" ? "text-primary-400" : ""}
                >
                  Security
                </a>
              </li>
            </ul>
          </nav>
        </header>
        <hr className="border-t border-gray-200" />

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3 mb-5">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {activeTab === "Account" && <span>Account Details</span>}
              {activeTab === "Security" && <span>Security Information</span>}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>
            <p className="mt-1 text-xs leading-6 text-gray-400">
              Created:
              {moment(profile?.user?.createdAt).format("YYYY-MM-DD")}
            </p>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            {activeTab === "Account" && (
              <AccountDetails
                profile={profile}
                refetchProfile={refetchProfile}
              />
            )}
            {activeTab === "Security" && <AccountSecurity profile={profile} />}
          </div>
        </div>
        {activeTab === "Security" && (
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 text-black">
                Delete account
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                No longer want to use our service? You can delete your account
                here. This action is not reversible. All information related to
                this account will be deleted permanently.
              </p>
            </div>

            <form className="flex items-start md:col-span-2">
              <Button variant={"destructive"} type="submit">
                Yes, delete my account
              </Button>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </UserLayout>
  );
};

export default Account;
