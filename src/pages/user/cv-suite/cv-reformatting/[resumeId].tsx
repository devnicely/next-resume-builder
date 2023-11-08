import { useRouter } from "next/router";
import React from "react";
import UserLayout from "~/components/layout/UserLayout";
import { api } from "~/utils/api";

const ResumeDetails = () => {
  const router = useRouter();
  const { resumeId } = router.query;

  const { data } = api.resume.getResumeJsonFromGcloud.useQuery(
    { resumeId },
    { enabled: !!resumeId }
  );

  return <UserLayout>{JSON.stringify(data)}</UserLayout>;
};

export default ResumeDetails;
