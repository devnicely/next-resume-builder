import { handleRedirection } from "middleware";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useState } from "react";
import LoadingSkeleton from "~/components/LoadingSkeleton";
import { notify } from "~/components/ReactHotToast";
import LoadingSpinner from "~/components/common/LoadingSpinner";
import AlertModal from "~/components/common/AlertModal";
import Footer from "~/components/layout/Footer";
import UserLayout from "~/components/layout/UserLayout";
import InviteTeamMemberModal from "~/components/team/InviteTeamMemberModal";
import RolesModal from "~/components/team/RolesModal";
import { useUserProfile } from "~/context/UserProfileContext";
import { api } from "~/utils/api";
import { PenSquare, Trash2, UserCircle, Send, Trash } from "lucide-react";
import { Button } from "~/components/common/button";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("PROTECTED")(ctx);
};

const roles = [
  {
    name: "owner",
    description: "This project would be available to anyone who has the link",
  },
  {
    name: "admin",
    description: "Only members of this project would be able to access",
  },
  {
    name: "member",
    description: "You are the only one able to access this project",
  },
];

export default function TeamMembers() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openPrivilegeModal, setOpenPrivilegeModal] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRole, setSelectedRole] = useState(roles[0].name);

  const { profile, organization } = useUserProfile()!;

  const {
    data: team,
    refetch,
    isLoading,
  } = api.team.getAllTeamMembers.useQuery();

  const { mutateAsync: deleteMember, isLoading: isDeleting } =
    api.team.deleteMember.useMutation();

  const { mutateAsync: updateMember, isLoading: isUpdating } =
    api.team.updateMember.useMutation();

  const { mutateAsync: resendTeamMemberInvite, isLoading: isResending } =
    api.team.resendTeamMemberInvite.useMutation();

  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    setOpenDeleteModal(true);
  };

  const handleDelete = () => {
    if (selectedMember) {
      void deleteMember({
        userId: selectedMember.id,
        orgId: team.orgId,
      })
        .then((payload) => {
          notify({ message: payload.message });
          void refetch();
        })
        .finally(() => {
          setOpen(false);
          setSelectedMember(null);
        });
    }
  };

  const updateRole = () => {
    try {
      void updateMember({
        userId: selectedMember.id,
        newRole: selectedRole.name,
      }).then((payload) => {
        notify({ message: payload.message });
        refetch();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const resendInviteEmail = (email) => {
    try {
      void resendTeamMemberInvite({
        orgId: organization.organization.id,
        email: email,
      }).then((payload) => {
        notify({ message: payload.message });
        refetch();
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserLayout title={"Team Members"}>
      <InviteTeamMemberModal open={open} setOpen={setOpen} refetch={refetch} />
      <AlertModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        func={handleDelete}
        title={"Remove Team Member"}
        message={"Are you sure you want to remove this team member?"}
        actionBtn={"Remove"}
      />
      <RolesModal
        refetch={refetch}
        roles={roles}
        setOpenPrivilegeModal={setOpenPrivilegeModal}
        openPrivilegeModal={openPrivilegeModal}
        func={updateRole}
        currentRole={selectedMember?.role}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />
      {isLoading ? (
        <div className="flex-1">
          <LoadingSkeleton />
        </div>
      ) : (
        <div className="flex-1">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm text-gray-700">
                A list of all the users in your account including their name,
                title, email and role.
              </p>
            </div>
            {profile?.user?.role === "member" ? null : (
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <Button
                  onClick={() => setOpen(() => !open)}
                  type="button"
                  className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Invite
                </Button>
              </div>
            )}
          </div>
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4 my-5"
          >
            {team?.teamMembers ?? team?.teamMembers.length
              ? team?.teamMembers.map((person) => (
                  <li
                    key={person.email}
                    className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
                  >
                    <div className="flex w-full items-center justify-between space-x-6 p-6">
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-sm font-medium text-gray-900">
                            {person.firstName}
                          </h3>
                          <span
                            className={`inline-flex flex-shrink-0 items-center rounded-full ${
                              person.status === "PENDING"
                                ? "bg-red-50 text-red-700 ring-red-600/20"
                                : "bg-green-50 text-green-700 ring-green-600/20"
                            } px-1.5 py-0.5 text-xs font-medium`}
                          >
                            {person.status === "PENDING"
                              ? person.status?.toLocaleLowerCase()
                              : person.role}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-gray-500">
                          {person.email}
                        </p>
                      </div>
                      {person.avatar ? (
                        <Image
                          className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                          src={person.avatar.url}
                          alt=""
                          width={40}
                          height={40}
                        />
                      ) : (
                        <UserCircle className="w-10 h-10 text-primary-600" />
                      )}
                    </div>
                    {profile?.user?.role === "member" ? null : (
                      <div>
                        <div className="-mt-px flex divide-x divide-gray-200">
                          {isDeleting && selectedMember === person ? (
                            <div className="flex w-0 flex-1 justify-center items-center gap-3 text-sm  font-semibold text-gray-900">
                              <LoadingSpinner />{" "}
                              <span className="text-xs">Deleting...</span>
                            </div>
                          ) : (
                            <div className="flex w-0 flex-1 cursor-pointer">
                              <div
                                onClick={() => handleDeleteClick(person)}
                                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-1 rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-900"
                              >
                                <Trash
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                Delete
                              </div>
                            </div>
                          )}
                          {person.status === "PENDING" ? (
                            <div className="flex w-0 flex-1 cursor-pointer">
                              {isResending && selectedMember === person ? (
                                <div className="flex w-0 flex-1 justify-center items-center gap-3 text-sm font-semibold text-gray-900">
                                  <LoadingSpinner />{" "}
                                  <span className="text-xs">Sending</span>
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    setSelectedMember(person);
                                    resendInviteEmail(person.email);
                                  }}
                                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-1 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                >
                                  <Send
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  Resend
                                </div>
                              )}
                            </div>
                          ) : null}

                          <div
                            onClick={() => {
                              setSelectedMember(person);
                              setOpenPrivilegeModal(true);
                            }}
                            className="-ml-px flex w-0 flex-1 cursor-pointer"
                          >
                            {isUpdating && selectedMember === person ? (
                              <div className="flex w-0 flex-1 justify-center items-center gap-3 text-sm  font-semibold text-gray-900">
                                <LoadingSpinner />{" "}
                                <span className="text-xs">Updating...</span>
                              </div>
                            ) : (
                              <a className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-1 rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-900">
                                <PenSquare
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                Edit
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}

      <Footer />
    </UserLayout>
  );
}
