import { Building, Trash } from "lucide-react";
import Image from "next/image";
import React from "react";

const OrganizationHeader = ({
  setIsEdit,
  isEdit,
  formData,
  handleFileClick,
  handleImageChange,
  fileInputRef,
  avatarBase64,
  profile,
}) => {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded-md">
      <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-4  w-full">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {avatarBase64 ? (
                <Image
                  width={100}
                  height={100}
                  src={avatarBase64}
                  alt=""
                  className="h-14 w-14 flex-none rounded-lg bg-gray-800 object-cover"
                />
              ) : formData.orgAvatar ? (
                <Image
                  width={100}
                  height={100}
                  src={formData.orgAvatar.url}
                  alt=""
                  className="h-12 w-12 flex-none rounded-lg bg-gray-800 object-cover"
                />
              ) : (
                <Building className="  w-12 h-12 bg-primary-500 rounded-md p-1 text-white" />
              )}
            </div>

            {isEdit && (
              <div className="relative ml-4">
                <div>
                  <button
                    type="button"
                    onClick={handleFileClick}
                    className="block rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 peer-hover:bg-slate-50 peer-focus:ring-2 peer-focus:ring-blue-600"
                  >
                    Change
                  </button>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e)}
                  />
                  <p className=" text-xs leading-5 text-gray-400">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>
            )}

            <div className={`${isEdit ? "ml-auto text-left" : "ml-4"}`}>
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {formData.orgName}
              </h3>
              <p className="text-sm text-gray-500">
                <a href="#">@{formData.orgName}</a>
              </p>
            </div>
          </div>
        </div>
        {profile?.user?.role === "member" ? null : (
          <div className="ml-4 mt-4 flex flex-shrink-0 gap-3">
            {!isEdit && (
              <button
                type="button"
                className="relative inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-400"
              >
                <Trash
                  className="-ml-0.5 mr-1.5 h-5 w-5 text-white"
                  aria-hidden="true"
                />
                <span className="text-white">Delete organization</span>
              </button>
            )}
            {!isEdit && (
              <button
                type="button"
                onClick={() => setIsEdit((prevState) => !prevState)}
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                {isEdit ? "Update Information" : "Edit Information"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationHeader;
