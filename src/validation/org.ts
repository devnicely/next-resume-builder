import { object, string, number, type TypeOf, type z } from "zod";

export const updateOrganizationSchema = object({
  orgId: string(),
  orgName: string().optional(),
  orgLocation: string().optional(),
  orgHeadcount: number().optional(),
  orgPhone: string().optional(),
  orgWebsite: string().optional(),
  orgAbout: string().optional(),
  orgAvatar: object({
    url: string(),
    public_id: string(),
  }).optional(),
});

export const createOrganizationSchema = object({
  userId: string(),
  orgName: string(),
});

export const deleteOrganizationSchema = object({
  adminId: string(),
  orgId: string(),
});

export type UpdateOrganization = TypeOf<typeof updateOrganizationSchema>;
export type CreateOrganization = TypeOf<typeof createOrganizationSchema>;
export type DeleteOrganization = TypeOf<typeof deleteOrganizationSchema>;

export type OrgDetails = {
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
    createdAt: string;
  };
};
