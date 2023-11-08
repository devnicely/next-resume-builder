import { Rocket, User, Paperclip, DollarSign, Cake } from "lucide-react";
import moment from "moment";
import React, { FC } from "react";

type EventTypes = {
  applied: {
    bgColorClass: string;
    icon: React.ComponentType;
  };
  advanced: {
    bgColorClass: string;
    icon: React.ComponentType;
  };
  completed: {
    bgColorClass: string;
    icon: React.ComponentType;
  };
};

type TimelineItem = {
  id: number;
  type: keyof EventTypes;
  content: string;
  target: string;
  date: string;
  datetime: string;
};

type OrgDetails = {
  success: boolean;
  message: string;
  organization: {
    id: string;
    name: string;
    location: string;
    headcount: number;
    phone: string;
    website: string;
    about: string;
    createdAt: Date;
  };
};

const OrganizationTimeline = ({ orgDetails, timeline }) => {
  // console.log("orgDetails", orgDetails);
  const formattedDate = moment(orgDetails?.organization?.createdAt).format(
    "MMMM Do YYYY"
  );

  return (
    <section
      aria-labelledby="timeline-title"
      className="mb-3 lg:col-span-1 lg:col-start-3"
    >
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
          Timeline
        </h2>

        {/* Activity Feed */}
        <div className="mt-6 flow-root">
          <ul role="list" className="-mb-8">
            {/* Creation date Item */}
            <li>
              <div className="relative pb-8">
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white bg-gray-500`}
                    >
                      <Cake className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {`Successfully Registered`}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time>{formattedDate}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {/* Invited Team members */}
            <li>
              <div className="relative pb-8">
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-green-200"
                  aria-hidden="true"
                />
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white bg-orange-500`}
                    >
                      <User className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Invited first team members
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={timeline[0].datetime}>
                        {timeline[0].date}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {/* Bought subscription */}
            <li>
              <div className="relative pb-8">
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white bg-green-500`}
                    >
                      <DollarSign className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Purchased your first subscription
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={timeline[0].datetime}>
                        {timeline[0].date}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {/* Used resume parser */}
            <li>
              <div className="relative pb-8">
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white bg-purple-500`}
                    >
                      <Paperclip className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Used resume parser
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={timeline[0].datetime}>
                        {timeline[0].date}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {/* Set up job campaing*/}
            <li>
              <div className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white bg-yellow-500`}
                    >
                      <Rocket className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Set up your first job campaign
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={timeline[0].datetime}>
                        {timeline[0].date}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default OrganizationTimeline;
