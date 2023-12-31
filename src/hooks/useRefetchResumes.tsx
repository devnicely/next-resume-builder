import { useSession } from "next-auth/react";
import { type ChangeEvent, useState } from "react";
import { api } from "~/utils/api";

interface SessionData {
  user: {
    userId: string;
  };
  message: string;
  success: boolean;
}


const useRefetchResumes = (type: string) => {
  const { data: sessionData } = useSession() as { data: SessionData | null };
  const userId: string | undefined = sessionData?.user.userId;

  const {refetch: refetchGetResumes} = api.template.getResumes.useQuery({type});

  return { refetchGetResumes };
};

export default useRefetchResumes;
