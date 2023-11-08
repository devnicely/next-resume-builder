import { BadgeCheck, ThumbsUp, User } from "lucide-react";
import { handleRedirection } from "middleware";
import { type GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import { notify } from "~/components/ReactHotToast";
import Footer from "~/components/layout/Footer";
import UserLayout from "~/components/layout/UserLayout";
import EditOrgDetails from "~/components/organization/EditOrgDetails";
import OrganizationHeader from "~/components/organization/OrganizationHeader";
import OrganizationInformation from "~/components/organization/OrganizationInformation";
import OrganizationTimeline from "~/components/organization/OrganizationTimeline";
import { useUserProfile } from "~/context/UserProfileContext";
import convertFileToBase64 from "~/helpers/convertFileToBase64";
import { api } from "~/utils/api";
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("PROTECTED")(ctx);
};

const eventTypes = {
  applied: { icon: User, bgColorClass: "bg-gray-400" },
  advanced: { icon: ThumbsUp, bgColorClass: "bg-blue-500" },
  completed: { icon: BadgeCheck, bgColorClass: "bg-green-500" },
};

const timeline = [
  {
    id: 1,
    type: eventTypes.applied,
    content: "Applied to",
    target: "Front End Developer",
    date: "Sep 20",
    datetime: "2020-09-20",
  },
  {
    id: 2,
    type: eventTypes.advanced,
    content: "Advanced to phone screening by",
    target: "Bethany Blake",
    date: "Sep 22",
    datetime: "2020-09-22",
  },
  {
    id: 3,
    type: eventTypes.completed,
    content: "Completed phone screening with",
    target: "Martha Gardner",
    date: "Sep 28",
    datetime: "2020-09-28",
  },
  {
    id: 4,
    type: eventTypes.advanced,
    content: "Advanced to interview by",
    target: "Bethany Blake",
    date: "Sep 30",
    datetime: "2020-09-30",
  },
  {
    id: 5,
    type: eventTypes.completed,
    content: "Completed interview with",
    target: "Katherine Snyder",
    date: "Oct 4",
    datetime: "2020-10-04",
  },
];

export default function OrgDetails() {
  const { mutateAsync: updateOrg, isLoading } =
    api.organization.updateOrganization.useMutation();

  const { mutateAsync: uploadAvatar, isLoading: isUploadLoading } =
    api.upload.uploadAvatar.useMutation();

  const {
    organization: orgDetails,
    refetchProfile,
    profile,
  } = useUserProfile()!;

  const [isNewAvatar, setIsNewAvatar] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    orgName: "",
    orgWebsite: "",
    orgLocation: "",
    orgPhone: "",
    orgHeadcount: 0,
    orgAbout: "",
    orgAvatar: "",
  });

  useEffect(() => {
    if (orgDetails?.organization && isInitialLoad && !isNewAvatar) {
      setFormData({
        orgName: orgDetails.organization.name ?? "",
        orgWebsite: orgDetails.organization.website ?? "",
        orgLocation: orgDetails.organization.location ?? "",
        orgPhone: orgDetails.organization.phone ?? "",
        orgHeadcount: orgDetails.organization.headcount ?? 0,
        orgAbout: orgDetails.organization.about ?? "",
        orgAvatar: orgDetails.organization.orgAvatar ?? "",
      });
      setIsInitialLoad(false);
    }
  }, [orgDetails, isNewAvatar]);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData((prev) => ({ ...prev, orgHeadcount: value }));
  };

  const [avatarBase64, setAvatarBase64] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      setIsNewAvatar(true);
      setFileName(file.name);
      try {
        const base64data = await convertFileToBase64(file);
        setAvatarBase64(`data:image/jpeg;base64,${base64data}`);
        setFormData((prev) => ({ ...prev, orgAvatar: base64data }));
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  const handleOrgUpdate = async () => {
    try {
      let isChanged = false;
      const updatedData = {};
      const keyMapping = {
        orgName: "orgName",
        orgWebsite: "orgWebsite",
        orgLocation: "orgLocation",
        orgPhone: "orgPhone",
        orgHeadcount: "orgHeadcount",
        orgAbout: "orgAbout",
      };

      for (const [formKey, value] of Object.entries(formData)) {
        const orgKey = keyMapping[formKey] || formKey;
        if (
          orgDetails?.organization &&
          value !== orgDetails.organization[orgKey]
        ) {
          updatedData[orgKey] = value;
          isChanged = true;
        }
      }

      if (isNewAvatar) {
        try {
          const fileData = new FormData();
          const path = `organizations/${orgDetails?.organization.id}/organization_logo`;
          fileData.append("file", formData.orgAvatar);
          fileData.append("path", path);

          const input = {
            orgId: orgDetails?.organization?.id,
            file: formData.orgAvatar,
            path: path,
            imgName: fileName,
          };

          const uploadResponse = await uploadAvatar(input);

          if (uploadResponse && uploadResponse.success) {
            updatedData.orgAvatar = uploadResponse.image;
            isChanged = true;
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          return;
        }
      }

      const filteredUpdatedData = Object.fromEntries(
        Object.entries(updatedData).filter(([key, value]) => Boolean(value))
      );

      if (!isChanged) {
        notify({ message: "Nothing to update." });
        return;
      }

      await updateOrg({
        ...filteredUpdatedData,
        orgId: orgDetails?.organization?.id,
      }).then((payload) => {
        console.log("payloadpayloadpayload", payload);
        notify({ message: payload.message });
        refetchProfile();
        setIsNewAvatar(false);
      });
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  return (
    <UserLayout>
      <div className="flex-1">
        <main>
          {/* Page header */}
          <OrganizationHeader
            formData={formData}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            handleFileClick={handleFileClick}
            handleImageChange={handleImageChange}
            fileInputRef={fileInputRef}
            avatarBase64={avatarBase64}
            profile={profile}
          />
          {isEdit ? (
            <EditOrgDetails
              formData={formData}
              onChange={onChange}
              handleSliderChange={handleSliderChange}
              setIsEdit={setIsEdit}
              handleOrgUpdate={handleOrgUpdate}
              isLoading={isLoading}
              orgDetails={orgDetails}
              isUploadLoading={isUploadLoading}
            />
          ) : (
            <div className="mt-8 grid  grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
              <OrganizationInformation orgDetails={orgDetails} />
              <OrganizationTimeline
                timeline={timeline}
                orgDetails={orgDetails}
              />
            </div>
          )}
        </main>
      </div>
      <Footer />
    </UserLayout>
  );
}
