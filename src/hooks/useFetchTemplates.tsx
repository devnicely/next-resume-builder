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
  const {refetch: refetchGetTemplates} = api.template.getTemplates.useQuery();
  return { refetchGetTemplates };
};

export default useFetchTemplates;
