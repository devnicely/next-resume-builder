import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Minus, X, Plus, Rocket } from "lucide-react";

import SpinnerButton from "./SpinnerButton";
import { Button } from "./button";

export default function AdditionalCreditsModal({
  open,
  setOpen,
  func,
  inputValue,
  setInputValue,
  totalPrice,
  setTotalPrice,
  isCreditLoading,
}) {
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d+$/.test(value) && +value >= 1) {
      setInputValue(value);
      setTotalPrice(+value * 12);
    }
  };

  const handleIncrement = () => {
    setInputValue((prevValue) => {
      const newValue = prevValue === "" ? "1" : String(+prevValue + 1);
      setTotalPrice(+newValue * 12);
      return newValue;
    });
  };

  const handleDecrement = () => {
    setInputValue((prevValue) => {
      const newValue = String(Math.max(1, +prevValue - 1));
      setTotalPrice(+newValue * 12);
      return newValue;
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="hidden sm:fixed sm:inset-0 sm:block sm:bg-gray-500 sm:bg-opacity-75 sm:transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center sm:items-center sm:px-6 lg:px-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-105"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-105"
            >
              <Dialog.Panel className="flex w-full max-w-3xl transform text-left text-base transition sm:my-8">
                <div className=" bg-white relative flex w-full flex-col overflow-hidden pb-8 pt-6 sm:rounded-lg sm:pb-6 lg:py-8">
                  <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <h2 className="text-lg font-medium text-gray-900">
                      Credits{" "}
                    </h2>
                    <div
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>

                  <section aria-labelledby="cart-heading">
                    <h2 id="cart-heading" className="sr-only">
                      Items in your shopping cart
                    </h2>

                    <ul
                      role="list"
                      className="divide-y divide-gray-200 px-4 sm:px-6 lg:px-8"
                    >
                      <li className="flex py-8 text-sm sm:items-center">
                        <Rocket className="h-20 w-20 flex-none rounded-lg border p-2 text-primary-500 border-gray-200 sm:h-20 sm:w-20" />
                        <div className="ml-4 grid flex-auto grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-3 sm:ml-6 sm:flex sm:items-center sm:gap-0">
                          <div className="row-end-1 flex-auto sm:pr-6">
                            <h3 className="font-medium text-gray-900">
                              {inputValue
                                ? `${inputValue * 100} credits`
                                : "100 credits"}
                            </h3>
                          </div>
                          <p className="row-span-2 row-end-2 font-medium text-gray-600 sm:order-1 sm:ml-6 sm:w-1/3 sm:flex-none sm:text-right">
                            (USD$12 / 100 credits)
                          </p>
                          <div className="flex items-center sm:block sm:flex-none sm:text-center">
                            <div className="relative inline-flex items-center">
                              <div
                                onClick={handleIncrement}
                                className=" left-0 inset-y-0 px-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                              >
                                <Plus className="h-5 bg-primary-200 text-white rounded-lg w-5" />
                              </div>
                              <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="block w-12 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 "
                              />
                              <div
                                onClick={handleDecrement}
                                className=" right-0 inset-y-0 px-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                              >
                                <Minus className="h-5 bg-primary-200 text-white rounded-lg w-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </section>

                  <section
                    aria-labelledby="summary-heading"
                    className="mt-auto sm:px-6 lg:px-8"
                  >
                    <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
                      <h2 id="summary-heading" className="sr-only">
                        Order summary
                      </h2>

                      <div className="flow-root">
                        <dl className="-my-4 divide-y divide-gray-200 text-sm">
                          <div className="flex items-center justify-between py-4">
                            <dt className="text-base font-medium text-gray-900">
                              Order total
                            </dt>
                            <dd className="text-base font-medium text-gray-900">
                              USD${totalPrice}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </section>

                  <div className="mt-8 flex justify-end px-4 sm:px-6 lg:px-8">
                    <SpinnerButton
                      disabled={isCreditLoading}
                      loading={isCreditLoading}
                      onClick={() => func()}
                      type="submit"
                      className="hover:bg-primary focus-visible:outline-primary flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {isCreditLoading
                        ? "Redirecting you to checkout"
                        : "Continue to Payment"}
                    </SpinnerButton>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
