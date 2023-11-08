import React, { useState } from "react";
import SpinnerButton from "../common/SpinnerButton";

const EditOrgDetails = ({
  formData,
  onChange,
  handleSliderChange,
  setIsEdit,
  handleOrgUpdate,
  isLoading,
  orgDetails,
  isUploadLoading,
}) => {
  return (
    <div className="grid grid-cols-1 mb-5 mt-5">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid  grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="orgName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Organization name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="orgName"
                  id="orgName"
                  onChange={onChange}
                  value={formData.orgName}
                  disabled
                  className="block bg-gray-100 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="orgWebsite"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Website
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    http://
                  </span>
                  <input
                    type="text"
                    name="orgWebsite"
                    id="orgWebsite"
                    onChange={onChange}
                    value={formData.orgWebsite}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="www.example.com"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <div>
                <label
                  htmlFor="orgLocation"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Location
                </label>
                <select
                  id="orgLocation"
                  name="orgLocation"
                  onChange={onChange}
                  value={formData.orgLocation}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="orgPhone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <label htmlFor="country" className="sr-only">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    autoComplete="country"
                    value={formData.orgLocation}
                    // onChange={onChange}
                    className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                  >
                    <option>CN</option>
                    <option>HK</option>
                    <option>SG</option>
                  </select>
                </div>
                <input
                  type="text"
                  name="orgPhone"
                  id="orgPhone"
                  onChange={onChange}
                  value={formData.orgPhone}
                  className="block w-full rounded-md border-0 py-1.5 pl-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="+1 (555) 987-6543"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="orgHeadcount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Headcount : {formData.orgHeadcount} employees+
              </label>
              <div className="flex flex-col items-center my-2">
                <div className="relative w-full ">
                  <input
                    id="orgHeadcount"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.orgHeadcount}
                    onChange={handleSliderChange}
                    className="w-full h-1.5 bg-gray-500 rounded-full focus:outline-none focus:ring focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="orgAbout"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="orgAbout"
                  name="orgAbout"
                  rows={3}
                  onChange={onChange}
                  value={formData.orgAbout}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about your organization.
              </p>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10  py-4 ">
                <button
                  onClick={() => setIsEdit(false)}
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                <SpinnerButton
                  type="submit"
                  disabled={isLoading || isUploadLoading}
                  loading={isLoading || isUploadLoading}
                  onClick={() => handleOrgUpdate()}
                  className="hover:bg-primary focus-visible:outline-primary flex  justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {isLoading || isUploadLoading ? "Saving" : "Save"}
                </SpinnerButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrgDetails;
