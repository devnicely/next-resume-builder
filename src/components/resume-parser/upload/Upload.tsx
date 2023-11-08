import React, { type FC, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "~/components/common/button";
import { AddTeam } from "../addTeam/AddTeam";
import { notifyError } from "~/components/ReactHotToast";
import { Trash, UserPlus } from "lucide-react";
import { Separator } from "~/components/common/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/common/avatar";

const MAX_FILES = 5;

const Upload: FC<{ handleFileSelect: (files: File[]) => void }> = ({
  handleFileSelect,
  editedFileNames,
  setEditedFileNames,
  selectedUsersByFile,
  setSelectedUsersByFile,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleSelectedUsers = (users, fileIndex) => {
    const updatedUsersByFile = [...selectedUsersByFile];
    updatedUsersByFile[fileIndex] = users;
    setSelectedUsersByFile(updatedUsersByFile);
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newEditedFileNames = [...editedFileNames];
    newEditedFileNames[index] = e.target.value;
    setEditedFileNames(newEditedFileNames);
  };

  const handleFileDrop = (droppedFiles: File[]) => {
    const acceptedFiles: File[] = [];
    if (files.length + droppedFiles.length > MAX_FILES) {
      notifyError({ message: "You can upload a maximum of 5 PDF files." });
      return;
    }
    droppedFiles.forEach((file) => {
      if (file.type === "application/pdf") {
        acceptedFiles.push(file);
      }
    });

    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles);

      const newFileNames = acceptedFiles.map((file) => file.name);
      setFileNames([...fileNames, ...newFileNames]);
      const newEditedFileNames = [...editedFileNames, ...newFileNames];
      setEditedFileNames(newEditedFileNames);
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles([...files, ...newFiles]);
    } else {
      notifyError({ message: "Only PDF files are supported." });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileDrop,
  });

  const handleDelete = (index: number) => {
    const newFiles = [...files];
    const newFileNames = [...fileNames];
    const newEditedFileNames = [...editedFileNames];
    const newUserSelected = [...selectedUsersByFile];

    newFiles.splice(index, 1);
    newFileNames.splice(index, 1);
    newEditedFileNames.splice(index, 1);
    newUserSelected.splice(index, 1);

    setFiles(newFiles);
    setFileNames(newFileNames);
    setEditedFileNames(newEditedFileNames);
    setSelectedUsersByFile(newUserSelected);
  };

  const parse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type === "application/pdf") {
      handleFileSelect(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setFiles((prevFiles) => [...prevFiles, newFile]);
      setFileNames((prevFileNames) => [...prevFileNames, file.name]);
      const newEditedFileNames = [...editedFileNames, file.name];
      setEditedFileNames(newEditedFileNames);
    } else {
      notifyError({ message: "Only PDF files are supported." });
    }
  };

  return (
    <div className="col-span-full">
      <div {...getRootProps()}>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 bg-white">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <input
                {...getInputProps()}
                id="file-upload"
                name="file-upload"
                type="file"
                onChange={parse}
                accept="application/pdf"
                className="sr-only"
              />
              <span>Upload a file</span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF up to 10MB</p>
          </div>
        </div>
      </div>
      {fileNames.map((name, index) => (
        <React.Fragment key={index}>
          <div className="space-y-2 mt-3">
            {/* Grouping bg-white div and icons */}
            <div className="grid grid-cols-4 items-start gap-x-2 ">
              <div className=" sm:col-span-3 col-span-5">
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  value={editedFileNames[index] ?? name}
                  onChange={(e) => handleNameChange(e, index)}
                  placeholder="file title"
                />
              </div>
              {/* Icons */}
              <div className="sm:flex gap-1 col-span-1 hidden">
                <div
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 p-2 rounded-md"
                >
                  <Trash className="text-white w-5 h-5" />
                </div>
                <div
                  onClick={() => setOpen(true)}
                  className="bg-green-700 p-2 rounded-md"
                >
                  <UserPlus className="text-white w-5 h-5" />
                </div>

                <div>
                  <AddTeam
                    open={open}
                    setOpen={setOpen}
                    handleSelectedUsers={(users) =>
                      handleSelectedUsers(users, index)
                    }
                  />
                </div>
              </div>
              <div className="flex col-span-4 gap-2 sm:hidden mt-2">
                <Button
                  className="ml-auto  h-8 lg:flex bg-red-500 "
                  variant={"destructive"}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setOpen(true)}
                  className="w-full  h-8 lg:flex"
                  variant={"outline"}
                >
                  Add Team
                </Button>
              </div>
            </div>

            {/* Team Members */}
            {selectedUsersByFile[index] &&
            selectedUsersByFile[index].length > 0 ? (
              <div className="w-full">
                <h3 className="text-xs font-medium leading-6 text-gray-900">
                  Team Members
                </h3>
                <div className="grid grid-cols-5 sm:grid-cols-7 overflow-y-auto">
                  {selectedUsersByFile[index].map((person) => (
                    <div key={person.email} className="col-span-1 mt-1">
                      <Avatar>
                        {person.avatar ? (
                          <AvatarImage
                            src={person.avatar.url}
                            alt={person.firstName}
                          />
                        ) : (
                          <AvatarFallback>
                            {person?.firstName ? person?.firstName[0] : "A"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <Separator className="my-5" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Upload;
