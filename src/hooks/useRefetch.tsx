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

const useRefetch = () => {
  const { data: sessionData } = useSession() as { data: SessionData | null };
  const userId: string | undefined = sessionData?.user.userId;

  const { refetch: refetchResumes } = api.resume.getAllUserResumes.useQuery();

  return { refetchResumes };
};

export default useRefetch;
