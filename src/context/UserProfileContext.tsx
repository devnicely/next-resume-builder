import { type FC, type ReactNode, createContext, useContext } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

interface UserProfile {
  id: string;
  email: string | null;
  isVerified: boolean | null;
  avatar: Avatar | null;
  country: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string | Date;
  role: string;
  loginToken: string | null;
  loginTokenExpires: string | Date | null;
  verificationLinksSent: number;
}

enum MembershipStatus {
  ACTIVE,
  PENDING,
  DISABLED,
}

enum RoleEnumType {
  user,
  admin,
  owner,
  member,
  superAdmin,
}

interface Avatar {
  id: string;
  url: string;
  public_id: string;
  userId: string;
}

type OrgMembership = {
  orgId: string;
  userId: string;
  role: RoleEnumType;
  user: string;
  org: string;
  joinedAt: Date;
  status: MembershipStatus;
};

type OrganizationAvatar = {
  id: string;
  url: string;
  public_id: string;
  organizationId: string;
};

enum PlanType {
  FREE,
  STANDARD,
  PREMIUM,
  ENTERPRISE,
}

enum StripeSubscriptionStatus {
  incomplete,
  incomplete_expired,
  trialing,
  active,
  past_due,
  canceled,
  unpaid,
  paused,
}

interface OrgDetails {
  organization: {
    id: string;
    name: string;
    members: OrgMembership[];
    location: string;
    headcount: number;
    orgAvatarId: string;
    orgAvatar: OrganizationAvatar | null;
    phone: string;
    website: string;
    about: string;
    createdAt: Date;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripeSubscriptionStatus: StripeSubscriptionStatus;

    planType: PlanType;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
  organization?: OrgDetails;
}
interface SessionData {
  user: {
    userId: string;
  };
  message: string;
  success: boolean;
}
interface UserProfileContextProps {
  profile: ApiResponse | null | undefined;
  organization: ApiResponse | null | undefined;
  isOrgLoading: boolean | null | undefined;
  refetchProfile: () => Promise<void>;
}

interface UserProfileProviderProps {
  children: ReactNode;
}
const UserProfileContext = createContext<UserProfileContextProps | null>(null);

export const UserProfileProvider: FC<UserProfileProviderProps> = ({
  children,
}) => {
  const { data: sessionData } = useSession() as { data: SessionData | null };

  const userId: string | undefined = sessionData?.user.userId;
  let profile: ApiResponse | null | undefined = undefined;
  let organization: ApiResponse | null | undefined = undefined;

  const { data, refetch } = api.profile.getMyDetails.useQuery(undefined, {
    enabled: !!userId,
  });

  const { data: orgDetails, isLoading } =
    api.organization.getOrgDetails.useQuery(undefined, {
      enabled:
        !!data?.user?.memberships && data?.user?.memberships.length !== 0,
    });

  let isOrgLoading: boolean = isLoading;

  profile = data;
  organization = orgDetails;
  isOrgLoading = isLoading;

  const refetchProfile = async () => {
    await refetch();
  };

  return (
    <UserProfileContext.Provider
      value={{ profile, refetchProfile, organization, isOrgLoading }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextProps => {
  const context = useContext(UserProfileContext);
  if (context === null) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
