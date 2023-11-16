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

const useFetchTemplates = () => {
  const { data: sessionData } = useSession() as { data: SessionData | null };
  const userId: string = sessionData?.user.userId ?? "";
  const {refetch: refetchGetTemplates} = api.template.getTemplatesByUserId.useQuery({userId});

  return { refetchGetTemplates };
};

export default useFetchTemplates;
