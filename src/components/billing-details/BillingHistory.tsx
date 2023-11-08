import moment from "moment";
import React, { useEffect, useState } from "react";
import capitalizeFirstLetter from "~/helpers/capitalizeFirstLetter";
import { api } from "~/utils/api";
import SpinnerButton from "../common/SpinnerButton";
import Link from "next/link";
import LoadingSpinner from "../common/LoadingSpinner";
import { Button } from "../common/button";

const BillingHistory = ({ queryBillingPayments }) => {
  const transformBillingPayments =
    queryBillingPayments?.billingPayments?.map((item) => ({
      date: moment(item.subscriptionStartDate).format("MMMM Do YYYY"),
      planType: item.planType,
      amount: item.amount,
      invoiceId: item.invoiceId,
      billingCycle: item.billingCycle.toLowerCase(),
    })) ?? [];

  const transformCreditPurchases =
    queryBillingPayments?.creditPurchases?.map((item) => ({
      date: moment(item.createdAt).format("MMMM Do YYYY"),
      planType: item.planType,
      amount: item.amount,
      invoiceId: item.invoiceId,
    })) ?? [];

  const combinedData = [
    ...transformBillingPayments,
    ...transformCreditPurchases,
  ];

  const {
    mutateAsync: fetchReceiptUrl,
    isLoading,
    data,
  } = api.stripe.fetchReceiptUrl.useMutation();

  const sortedData = combinedData.sort((a, b) => a.date.localeCompare(b.date));

  const [currentInvoiceLoading, setCurrentInvoiceLoading] = useState(null);

  useEffect(() => {
    if (!isLoading && data?.receiptUrl) {
      window.open(data.receiptUrl, "_blank", "noopener,noreferrer");
      setCurrentInvoiceLoading(null); // Clear current invoice loading state
    }
  }, [isLoading, data]);

  const handleFetchReceiptUrl = async (payment) => {
    setCurrentInvoiceLoading(payment.invoiceId); // Set current invoice loading state
    await fetchReceiptUrl({
      invoiceId: payment.invoiceId,
      planType: payment.planType,
    });
  };

  return (
    <section aria-labelledby="billing-history-heading ">
      <div className=" bg-white mb-3 pt-6 shadow sm:overflow-hidden sm:rounded-md ">
        <div className="px-4 sm:px-6">
          <h2
            id="billing-history-heading"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Billing history
          </h2>
        </div>
        <div className="mt-6 flex flex-col ">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Amount
                      </th>

                      <th
                        scope="col"
                        className="relative px-6 py-3 text-left text-sm font-medium text-gray-500"
                      >
                        <span className="sr-only">View receipt</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white  ">
                    {sortedData && sortedData.length
                      ? sortedData.map((payment) => (
                          <tr key={payment.invoiceId}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                              <time dateTime={payment.date}>
                                {payment.date}
                              </time>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {capitalizeFirstLetter(payment.planType)} plan (
                              {payment.billingCycle})
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              ${payment?.amount}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                              {currentInvoiceLoading === payment.invoiceId &&
                              isLoading ? (
                                <div className="flex justify-end">
                                  <LoadingSpinner />
                                </div>
                              ) : (
                                <Button
                                  onClick={() => handleFetchReceiptUrl(payment)}
                                  className="text-primary-600 bg-white"
                                >
                                  View receipt
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BillingHistory;
