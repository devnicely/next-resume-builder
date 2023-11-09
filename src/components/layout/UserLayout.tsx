import { type FC, Fragment, type ReactNode, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import logo from "../../../public/assets/logo.png";
import Image from "next/image";

import { UserProfilePopup } from "./UserProfilePopup";
import Link from "next/link";
import { useRouter } from "next/router";
import ReminderAlert from "../common/ReminderAlert";
import { useUserProfile } from "~/context/UserProfileContext";
import { type OrgDetails } from "~/validation/org";
import { classNames } from "../common/Classnames";
import {
  Bell,
  Menu,
  X,
  AlertTriangle,
  GaugeCircle,
  Users,
  CreditCard,
  Building,
  Sparkles,
  Megaphone,
  Folder,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../common/button";

interface UserLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: string;
}

type Role = "admin" | "member" | "otherRole"; // Add more roles as needed

interface SidebarItem {
  current: boolean;
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>
  >;
  id?: number;
  subMenu?: SidebarItem[];
}

const UserLayout: FC<UserLayoutProps> = ({ children, title, subtitle }) => {
  const { profile, organization: orgDetails } = useUserProfile()!;
  // console.log("organization:", orgDetails);
  // console.log("profile:", profile);
  const hasEmptyFields = (obj: OrgDetails) => {
    if (!obj) return false;
    return Object.values(obj).some((value) => {
      return value === null || value === "";
    });
  };

  const sidebar: SidebarItem[] = [
    {
      name: "Home",
      href: "/user/dashboard",
      icon: GaugeCircle,
      current: false,
    },
    // {
    //   name: "Job campaigns",
    //   href: "/user/job-campaigns",
    //   icon: BriefcaseIcon,
    //   current: false,
    // },
    {
      name: "Prospecting & Outreach",
      href: "/user/prospecting",
      icon: Megaphone,
      current: false,
    },
    {
      name: "CV Suite",
      href: "",
      icon: FileSpreadsheet,
      current: false,
      subMenu: [
        {
          name: "Template Mgmt",
          href: "/user/cv-suite/template-mgmt/resumes",
          icon: Folder,
          current: false,
        },
        {
          name: "CV Reformatting",
          href: "/user/cv-suite/cv-reformatting",
          icon: Sparkles,
          current: false,
        },
      ],
    },

    {
      id: 1,
      name: "Organization",
      href: "/user/organization",
      icon: Building,
      current: false,
    },
    {
      id: 2,
      name: "Team Members",
      href: "/user/organization/team-members",
      icon: Users,
      current: false,
    },
    {
      id: 3,
      name: "Billing & Plans",
      href: "/user/organization/billing-plans",
      icon: CreditCard,
      current: false,
    },
  ];

  const filterSidebarItems = (
    items: SidebarItem[],
    role: Role
  ): SidebarItem[] => {
    return items.filter((item) => {
      if (item.name === "Billing & Plans" && role === "member") {
        return false;
      }
      // Add more conditions based on roles here...
      return true;
    });
  };
  const role = profile?.user.role; // Assuming profile.user.role exists and contains role as string
  const filteredSidebarItems = filterSidebarItems(sidebar, role as Role);

  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [isSidebarExpanding, setSidebarExpanding] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [wasSubMenuOpen, setWasSubMenuOpen] = useState(false);

  const handleItemClick = (clickedItem: { name: string }) => {
    if (clickedItem.name !== "CV Suite") {
      setActiveItem(clickedItem.name);
    }
    if (clickedItem.name === "CV Suite") {
      setSubMenuOpen((prevState) => !prevState);
    }
  };

  const router = useRouter();

  const [sidebarNavigation, setSidebarNavigation] = useState(
    sidebar.map((item) => ({
      ...item,
      current: router.pathname.endsWith(item.href),
    }))
  );

  useEffect(() => {
    const newSidebarNavigation = sidebarNavigation.map((item) => {
      const isActive = router.pathname.startsWith(item.href);
      if (isActive && item.name !== "CV Suite") {
        setActiveItem(item.name);
      }
      return { ...item, current: isActive };
    });
    setSidebarNavigation(newSidebarNavigation);

    if (router.pathname === "/user/dashboard") {
      setActiveItem("Home");
    }
  }, [router.pathname]);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isSidebarExpanding) {
      const timer = setTimeout(() => setShowAlert(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
    }
  }, [isSidebarExpanding]);

  return (
    <div className="grid h-full bg-slate-50 sm:gap-x-3 md:grid-cols-[auto,1fr]">
      {/* Static sidebar for desktop */}
      <div
        className="hidden transition-all duration-300 ease-in-out hover:w-72 md:grid md:h-screen md:w-20 md:flex-col"
        onMouseEnter={() => {
          setSidebarExpanding(true);
          setSidebarExpanded(true);
          if (wasSubMenuOpen) {
            setSubMenuOpen(true);
          }
        }}
        onMouseLeave={() => {
          setSidebarExpanding(false);
          setSidebarExpanded(false);
          setWasSubMenuOpen(isSubMenuOpen);
          setSubMenuOpen(false);
        }}
      >
        <div className="flex flex-grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-primary-500 px-6 pb-4 pr-5">
          <div className="flex h-16 shrink-0 items-center">
            <Image
              className="mx-auto h-12 w-auto object-contain"
              src={logo}
              alt="Prospect ai"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-col gap-y-2">
              {/* Adjusted vertical spacing between menu items */}
              {filteredSidebarItems.map((item) => (
                <Fragment key={item.name}>
                  <li>
                    <Link
                      href={item.href || "#"}
                      onClick={() => handleItemClick(item)}
                    >
                      <div
                        className={`relative flex justify-between items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-all duration-300 ${
                          item.name === activeItem
                            ? "bg-primary-300 text-white"
                            : "text-white hover:bg-primary-300 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className={`h-6 w-6 flex-none ${
                              item.name === activeItem
                                ? "text-white"
                                : "text-primary-700 hover:text-white"
                            }`}
                            aria-hidden="true"
                          />
                          <span
                            className={`absolute left-10 transition-opacity ${
                              isSidebarExpanded
                                ? "delay-200 duration-100"
                                : "delay-0 duration-100"
                            } ${isSidebarExpanded ? "visible" : "invisible"}`}
                            style={{
                              opacity: isSidebarExpanded ? 1 : 0,
                            }}
                          >
                            {item.name}
                          </span>
                        </div>
                        {item.name === "CV Suite" &&
                          isSidebarExpanded &&
                          (isSubMenuOpen ? <ChevronUp /> : <ChevronDown />)}
                      </div>
                    </Link>
                  </li>
                  {item.name === "CV Suite" &&
                    isSidebarExpanded &&
                    isSubMenuOpen &&
                    item.subMenu?.map((subItem) => (
                      <li key={subItem.name} className="pl-10 space-y-1 ">
                        {" "}
                        {/* Reduced vertical spacing */}
                        <Link href={subItem.href}>
                          <div
                            className={`relative   flex gap-x-3 rounded-md p-2 text-xs font-semibold leading-6 transition-all duration-300 ${
                              subItem.name === activeItem
                                ? "bg-primary-300 text-white"
                                : "text-white hover:bg-primary-300 hover:text-white"
                            }`}
                            onClick={() => setActiveItem(subItem.name)}
                          >
                            <subItem.icon
                              className={`h-6 w-6 flex-none ${
                                subItem.name === activeItem
                                  ? "text-white"
                                  : "text-primary-700 hover:text-white "
                              }`}
                              aria-hidden="true"
                            />
                            {subItem.name}
                          </div>
                        </Link>
                      </li>
                    ))}
                  {item.name === "CV Suite" && isSidebarExpanded && (
                    <hr className="my-2 border-t border-gray-400" />
                  )}
                </Fragment>
              ))}
            </ul>
          </nav>

          {isSidebarExpanding ? (
            <div
              style={{
                opacity: showAlert ? 1 : 0,
                transition: "opacity 300ms ease-in-out",
              }}
            >
              {hasEmptyFields(orgDetails?.organization) &&
                (profile?.user.role === "admin" ||
                  profile?.user.role === "owner") && (
                  <ReminderAlert
                    title={"Alert Message"}
                    message={"Complete your organization profile information"}
                  />
                )}
            </div>
          ) : (
            <>
              {hasEmptyFields(orgDetails?.organization) &&
                (profile?.user.role === "admin" ||
                  profile?.user.role === "owner") && (
                  <div className=" bg-yellow-50 py-3 px-2 rounded-md">
                    <AlertTriangle
                      className="h-5 w-5 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                )}
            </>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20 md:hidden"
          onClose={setMobileMenuOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-primary-500 pb-4 pt-5">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-0 top-1 -mr-14 p-1">
                    <Button
                      type="button"
                      className="mr-7 flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                      <span className="sr-only">Close sidebar</span>
                    </Button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <Image
                    className="mx-auto h-20 w-auto"
                    src={logo}
                    alt="Prospect ai"
                  />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                  <nav className="flex h-full flex-col">
                    <div className="space-y-1">
                      {filteredSidebarItems.map((item) => (
                        <Fragment key={item.name}>
                          <Link
                            href={item.name === "CV Suite" ? "#" : item.href}
                            onClick={(e) => {
                              if (item.name === "CV Suite") {
                                e.preventDefault();
                                setSubMenuOpen((prevState) => !prevState);
                              } else {
                                setActiveItem(item.name);
                                if (item.subMenu) {
                                  setWasSubMenuOpen(false);
                                }
                              }
                            }}
                            className={classNames(
                              item.current && item.name !== "CV Suite"
                                ? "bg-primary-700 text-white"
                                : "text-primary-100 hover:bg-primary-700 hover:text-white",
                              "group flex items-center justify-between rounded-md px-3 py-2 text-sm  font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            <div className="flex items-center">
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? "text-primary-300"
                                    : "text-primary-300 group-hover:text-white",
                                  "mr-3 h-6 w-6"
                                )}
                                aria-hidden="true"
                              />
                              <span>{item.name}</span>
                            </div>
                            {/* Add chevron icon if item is "CV Suite" */}
                            {item.name === "CV Suite" &&
                              (isSubMenuOpen ? <ChevronUp /> : <ChevronDown />)}
                          </Link>
                          {/* Submenu items */}
                          {item.name === "CV Suite" &&
                            isSubMenuOpen &&
                            item.subMenu?.map((subItem, index) => (
                              <a
                                key={index}
                                href={subItem.href}
                                onClick={() => {
                                  setActiveItem(subItem.name);
                                  setWasSubMenuOpen(true);
                                }}
                                className={classNames(
                                  subItem.name === activeItem
                                    ? "bg-primary-700 text-white"
                                    : "text-primary-100 hover:bg-primary-700 hover:text-white",
                                  "group flex items-center rounded-md px-3 py-2 text-sm  font-medium ml-6"
                                )}
                              >
                                <subItem.icon
                                  className={classNames(
                                    subItem.name === activeItem
                                      ? "text-white"
                                      : "text-primary-300 group-hover:text-white",
                                    "mr-3 h-6 w-6"
                                  )}
                                  aria-hidden="true"
                                />
                                <span>{subItem.name}</span>
                              </a>
                            ))}
                          {/* Horizontal line under "CV Reformatting" */}
                          {item.name === "CV Reformatting" && (
                            <hr
                              style={{
                                marginBottom: "1.25rem",
                                marginTop: "1.25rem",
                              }}
                              className="border-t border-gray-400"
                            />
                          )}
                        </Fragment>
                      ))}
                    </div>

                    <div className="mt-5">
                      {hasEmptyFields(orgDetails?.organization) &&
                        (profile?.user.role === "admin" ||
                          profile?.user.role === "owner") && (
                          <ReminderAlert
                            title={"Alert Message"}
                            message={
                              "Complete your organization profile information"
                            }
                          />
                        )}
                    </div>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Content area */}
      <div className="mx-2 flex flex-1 flex-col overflow-hidden sm:mr-5">
        <header className="w-full z-50">
          <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4 sm:px-6">
              <div className="flex flex-1"></div>
              <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <Bell className="h-6 w-6" aria-hidden="true" />
                  <span className="sr-only">View notifications</span>
                </button>
                {/* Profile dropdown */}
                <UserProfilePopup />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 items-stretch overflow-hidden">
          <main className=" flex-1 overflow-y-auto">
            <div className="max-w-7 mx-auto text-lg sm:text-xl">
              {title}
            </div>
            <div className="text-sm">{subtitle}</div>
            <section
              aria-labelledby="primary-heading"
              className="flex h-full min-w-0 flex-1 flex-col  lg:order-last"
            >
              {children}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
