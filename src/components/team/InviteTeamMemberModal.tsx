import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Plus, Trash } from "lucide-react";
import { useUserProfile } from "~/context/UserProfileContext";
import { inviteTeamMemberSchema } from "~/validation/team";
import { notify, notifyError } from "../ReactHotToast";
import { api } from "~/utils/api";
import SpinnerButton from "../common/SpinnerButton";

export default function InviteTeamMemberModal({ open, setOpen, refetch }) {
  const cancelButtonRef = useRef(null);
  const [emailFields, setEmailFields] = useState([""]);
  const { profile, organization } = useUserProfile()!;

  const { mutateAsync: inviteTeamMember, isLoading } =
    api.team.inviteTeamMember.useMutation();

  const handleInputChange = (index, event) => {
    const values = [...emailFields];
    values[index] = event.target.value;
    setEmailFields(values);
  };

  const handleAddFields = () => {
    setEmailFields([...emailFields, ""]);
  };

  const handleRemoveFields = (index) => {
    const values = [...emailFields];
    values.splice(index, 1);
    setEmailFields(values);
  };

  const sendInvitationToEmployees = async () => {
    const validEmails = emailFields.filter((email) => email !== "");

    const payload = {
      emails: validEmails,
      orgId: organization.organization.id,
    };

    const validationResult = inviteTeamMemberSchema.safeParse(payload);

    if (validationResult.success) {
      await inviteTeamMember(validationResult.data).then((payload) => {
        notify({ message: payload.message });
        refetch();
        setEmailFields([""]);
      });
    } else {
      notifyError({ message: "Unaccepted email format" });
      console.log("Validation errors:", validationResult.error);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className=" text-left ">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Invite Team Members
                    </Dialog.Title>
                    <div className="mt-2">
                      <li className="text-sm text-gray-500">
                        Access all prospecting / CV screening services across
                        your firm.
                      </li>
                      <li className="text-sm text-gray-500">
                        Keep your communication on the same page and provide
                        feedback directly.
                      </li>
                    </div>
                  </div>
                  <div className="mt-5">
                    {emailFields.map((email, index) => (
                      <div key={index} className="flex items-center ">
                        <input
                          type="email"
                          name="email"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                          placeholder="workemail@company.com"
                          value={email}
                          onChange={(event) => handleInputChange(index, event)}
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFields(index)}
                          >
                            <Trash className="ml-2 h-6 w-6 text-gray-400" />
                          </button>
                        )}
                      </div>
                    ))}
                    <span
                      className="mt-2 flex cursor-pointer items-center text-sm text-green-500"
                      onClick={handleAddFields}
                    >
                      <Plus className="h-5 w-5" /> Invite more
                    </span>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <SpinnerButton
                    loading={isLoading}
                    disabled={isLoading}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2"
                    onClick={sendInvitationToEmployees}
                  >
                    Send invitation email
                  </SpinnerButton>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
