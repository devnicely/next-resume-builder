import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useUserProfile } from "~/context/UserProfileContext";
import Image from "next/image";
import { classNames } from "../common/Classnames";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../common/avatar";
import LoadingSpinner from "../common/LoadingSpinner";

type UserNavigationItem = {
  name: string;
  href: string;
};

const userNavigation: UserNavigationItem[] = [
  { name: "My Profile", href: "/user/account" },
  { name: "Sign out", href: "#" },
];

export const UserProfilePopup = () => {
  const { profile } = useUserProfile()!;

  const router = useRouter();
  const handleAction = async (href: string) => {
    if (href === "#") {
      await signOut({ callbackUrl: "/auth/login" });
    } else {
      await router.push("/user/account");
    }
  };

  return (
    <Menu as="div" className="relative flex-shrink-0">
      <div>
        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          <span className="sr-only">Open user menu</span>

          {profile?.user ? (
            <Avatar
              key={profile.user.email}
              className="inline-block border-2 border-background"
            >
              {profile.user.avatar ? (
                <AvatarImage src={profile?.user?.avatar.url} />
              ) : (
                <AvatarFallback>
                  {profile?.user?.firstName ? profile.user.firstName[0] : "A"}
                </AvatarFallback>
              )}
            </Avatar>
          ) : (
            <LoadingSpinner />
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <div
                  role="button"
                  tabIndex={0}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block cursor-pointer px-4 py-2 text-sm text-gray-700"
                  )}
                  onClick={() => handleAction(item.href)}
                >
                  {item.name}
                </div>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
