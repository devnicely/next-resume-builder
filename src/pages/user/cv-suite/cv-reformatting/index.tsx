import moment from "moment";
import React from "react";
import Footer from "~/components/layout/Footer";
import UserLayout from "~/components/layout/UserLayout";
import { columns } from "~/components/resume-parser/table/components/columns";
import { DataTable } from "~/components/resume-parser/table/components/data-table";
import { useUserProfile } from "~/context/UserProfileContext";
import { api } from "~/utils/api";

const Resume = () => {
  const { profile } = useUserProfile();
  const { data, refetch } = api.resume.getAllUserResumes.useQuery();
  console.log("data", data);
  const transformedData =
    data?.response?.map((item) => ({
      id: item.resumeId,
      title: item.title,
      status: item.status,
      lastUpdatedBy: item.lastUpdatedByName,
      uploadedBy: item.uploadedBy.firstName,
      team: item.team
        ? item.team.map((m) => ({
            firstName: m.firstName,
            avatar: m.avatar || null,
            permission: m.permission,
          }))
        : [],
      date: moment(item.createdAt).format("DD/MM/YYYY"),
    })) || [];

  return (
    <UserLayout title={"CV reformatting"}>
      <div className="flex-1 mb-5 w-full">
        <DataTable data={transformedData} columns={columns} />
      </div>
      <Footer />
    </UserLayout>
  );
};

export default Resume;
