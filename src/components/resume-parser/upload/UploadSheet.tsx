import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/common/sheet";
import { Button } from "~/components/common/button";
import Upload from "./Upload";
import UploadBtn from "./UploadBtn";
import { api } from "~/utils/api";
import LoadingSpinner from "~/components/common/LoadingSpinner";
import useRefetch from "~/hooks/useRefetch";

const UploadSheet = () => {
  const { mutateAsync: parseResume, isLoading } =
    api.resume.parseResume.useMutation();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editedFileNames, setEditedFileNames] = useState<string[]>([]);
  const [selectedUsersByFile, setSelectedUsersByFile] = useState([]);
  const [isSheetOpen, setSheetOpen] = useState(false);
  // const { refetchResumes } = useRefetch();

  const handleFileSelect = (newFiles: File[]) => {
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  useEffect(() => {
    if (!isSheetOpen) {
      setSelectedFiles([]);
      setEditedFileNames([]);
      setSelectedUsersByFile([]);
    }
  }, [isSheetOpen]);

  const handleParseClick = () => {
    setSheetOpen(false);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const title = editedFileNames[i];
      const membersToInvite =
        selectedUsersByFile[i]?.map(({ id, permission, email }) => ({
          id,
          permission,
          email,
        })) || [];

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async function () {
        const base64data = reader.result?.toString().split(",")[1];

        if (base64data && title) {
          try {
            await parseResume({
              base64pdfs: [base64data],
              titles: [title],
              teamMembers: membersToInvite.length > 0 ? membersToInvite : [],
            }).then(() => refetchResumes());
          } catch (error) {
            console.error(`Error in parseResume for file #${i + 1}:`, error);
          }
        } else {
          console.warn(
            `Skipped parseResume for file #${i + 1} due to incomplete data.`
          );
        }
      };
    }
  };

  return (
    <div>
      {isLoading && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <span>Please be patient...</span>
          <LoadingSpinner />
        </div>
      )}
      <Sheet open={isSheetOpen} onOpenChange={(open) => setSheetOpen(open)}>
        <SheetTrigger asChild>
          <Button
            onClick={() => setSheetOpen(true)}
            variant="outline"
            size="sm"
            className="ml-auto  h-8 lg:flex"
          >
            Upload resume
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Upload resumes</SheetTitle>
            <SheetDescription>
              Upload up to 5 resumes at each time.
            </SheetDescription>
            <UploadBtn handleParseClick={handleParseClick} />
          </SheetHeader>
          <form className="flex h-full flex-col overflow-y-scroll ">
            <div className="flex-1">
              {/* Header */}

              {/* Divider container */}
              <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                <div className="mt-3">
                  <Upload
                    handleFileSelect={handleFileSelect}
                    editedFileNames={editedFileNames}
                    setEditedFileNames={setEditedFileNames}
                    selectedUsersByFile={selectedUsersByFile}
                    setSelectedUsersByFile={setSelectedUsersByFile}
                  />
                </div>
                {/* Project description */}
                {/* <div className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:py-5">
                  <div>
                    <label
                      htmlFor="project-description"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                    >
                      Description
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <textarea
                      id="project-description"
                      name="project-description"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UploadSheet;
