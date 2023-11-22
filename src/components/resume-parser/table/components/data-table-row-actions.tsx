import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { Button } from "~/components/common/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu";
import { api } from "~/utils/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/common/alert-dialog";
import { notify } from "~/components/ReactHotToast";
import useRefetch from "~/hooks/useRefetch";

import DataTableEditModal from "./data-table-edit-modal";
import { AddTeam } from "../../addTeam/AddTeam";
import { useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

  const id = row.getValue("id");
  const title = row.getValue("title");
  // const status = row.getValue("status");
  const [dataToUpdate, setDataToUpdate] = useState({
    title,
    // , status
  });

  const { mutateAsync: getSingleResume, data: singleResume } =
    api.resume.getSingleResume.useMutation();

  const { mutateAsync: deleteResumes } = api.resume.deleteResumes.useMutation();

  const { mutateAsync: updateTeamResumeAccess } =
    api.resume.updateTeamResumeAccess.useMutation();

  const { mutateAsync: updateResumeTitleStatus } =
    api.resume.updateResumeTitleStatus.useMutation();

  const { refetchResumes } = useRefetch();

  const deleteCV = async (id) => {
    await deleteResumes({ resumeIds: [id] }).then(() => {
      notify({ message: "Delete success" });
      void refetchResumes();
    });
  };

  const handleSelectedUsers = (newSelectedUsers) => {
    setSelectedTeamMembers(newSelectedUsers);
  };

  const updateTeamAccess = async () => {
    try {
      const teamMembersData = selectedTeamMembers.map((member) => {
        return {
          userId: member.id,
          permission: member.permission,
        };
      });

      await updateTeamResumeAccess({
        resumeId: id,
        teamMembers: teamMembersData,
      }).then(() => {
        notify({ message: "Team access updated" });
        void refetchResumes();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateDocument = async () => {
    try {
      console.log({
        resumeId: id,
        title: dataToUpdate.title,
        // status: dataToUpdate.status,
      });
      await updateResumeTitleStatus({
        resumeId: id,
        title: dataToUpdate.title,
        // status: dataToUpdate.status,
      }).then(() => {
        notify({ message: "Update success" });
        refetchResumes();
      });
      // Show a success notification here if needed
    } catch (error) {
      console.log(error);
      // Show an error notification here if needed
    }
  };

  const handleChange = (field, value) => {
    setDataToUpdate((prevData) => ({ ...prevData, [field]: value }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* Modal */}

        <DataTableEditModal
          title={title}
          // status={status}
          dataToUpdate={dataToUpdate}
          setDataToUpdate={setDataToUpdate}
          updateDocument={updateDocument}
          onChange={handleChange}
        />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            getSingleResume({ resumeId: id });
            setDialogOpen(true);
          }}
        >
          Team
        </DropdownMenuItem>

        <AddTeam
          open={isDialogOpen}
          setOpen={setDialogOpen}
          initialTeam={singleResume?.resumeDetails?.team || []}
          handleSelectedUsers={handleSelectedUsers}
          updateTeamAccess={updateTeamAccess}
        />

        <DropdownMenuItem>Download</DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Once deleted you will not be able to access this document.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-primary-500"
                onClick={() => deleteCV(id)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
