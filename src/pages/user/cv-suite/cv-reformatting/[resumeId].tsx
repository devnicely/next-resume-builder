import { cloneDeep, set } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/common/button";
import UserLayout from "~/components/layout/UserLayout";
import { emptyDefaultResume } from "~/constants";
import { Resume, ResumeSchemaType } from "~/schema";
import { ParsedResume } from "~/schema/parsedresume";
import { useAppDispatch } from "~/store/hooks";
import { setModalState } from "~/store/modal/modalSlice";
import { setResume } from "~/store/resume/resumeSlice";
import { api } from "~/utils/api";
import { v4 as uuidv4 } from 'uuid';
import JSON5 from 'json5'
import ScreenLoading from "~/components/common/ScreenLoading";
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/common/dropdown-menu";
import { ExternalLink, MoreVertical, PencilLine, Trash2 } from "lucide-react";
import { notify } from "~/components/ReactHotToast";
import { log } from "console";

type Props = {
  resume: ResumeSchemaType,
  handleDelete: (pos: string) => void;
  handleOpen: (pos: string) => void;
}

const PreResume: React.FC<Props> = ({ resume, handleDelete, handleOpen }) => {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="items-center justify-center shadow h-52 w-40 cursor-pointer rounded-sm bg-zinc-100 transition-opacity hover:opacity-80 dark:bg-zinc-900">
        <Image src={resume.image} alt={resume.name} priority width={400} height={0} />
      </div>
      <footer className="flex items-center pl-2 justify-between overflow-hidden">
        <div className="text-xs leading-relaxed opacity-50">
          <p>{resume.name}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex-1 h-full w-full cursor-pointer rounded text-lg text-black">
              <MoreVertical size="28" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleOpen(resume.id)}>
              <ExternalLink size="16" /> &nbsp; Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(resume.id)}>
              <Trash2 size="16" /> &nbsp; Delete
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => alert(1)}>
              <PencilLine size="16" /> &nbsp; Rename
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>
    </div>
  )
}


const ResumeDetails = () => {
  const router = useRouter();
  const { resumeId } = router.query;
  const dispatch = useAppDispatch();

  const { data, isError, isSuccess, isLoading } = api.resume.getResumeJsonFromGcloud.useQuery(
    { resumeId: resumeId as string },
    { enabled: !!resumeId }
  );

  const { data: resumes, isLoading: isLoadingResumes, refetch } = api.template.getResumesByResumeId.useQuery({ resumeId: resumeId as string });

  const handleOpen = (id: string) => {
    router.push({ pathname: "/resuming/[id]/build", query: { id } });
  }

  const {
    mutateAsync: deleteResume,
  } = api.template.deleteResume.useMutation();



  const handleClose = () => {
    dispatch(setModalState({
      modal: 'delete-confirm-modal',
      state: { open: false }
    }));
  }

  const handleDelete = async (id: string) => {
    dispatch(
      setModalState({
        modal: 'delete-confirm-modal',
        state: {
          open: true,
          payload: {
            onComplete: async () => {
              await deleteResume({ id });
              refetch();
              handleClose();
            },
          },
        },
      }),
    );
  }

  const handleClick = () => {
    if (data) {
      const parsedResume: ParsedResume = JSON5.parse(data.json as string);

      let defaultResume: Resume = cloneDeep(emptyDefaultResume);

      // set resume content
      set(defaultResume, 'resumeId', resumeId);

      try {
        set(defaultResume.basics, 'email', parsedResume.basic_info?.email);
      } catch (error) {
        console.log(error);
      }

      try {
        set(defaultResume.basics, 'name', parsedResume.basic_info?.full_name);
      } catch (error) {
        console.log(error);
      }

      try {
        set(defaultResume.basics, 'phone', parsedResume.basic_info?.phone_number);
      } catch (error) {
        console.log(error);
      }

      try {
        set(defaultResume.basics, 'summary', parsedResume.basic_info?.summary_description);
      } catch (error) {
        console.log(error);
      }

      try { set(defaultResume.basics.location, 'address', parsedResume.basic_info?.location.address); } catch (error) { console.log(error); }
      try { set(defaultResume.basics.location, 'city', parsedResume.basic_info?.location.city); } catch (error) { console.log(error); }
      try { set(defaultResume.basics.location, 'postalCode', parsedResume.basic_info?.location.zip_code); } catch (error) { console.log(error); }
      try { set(defaultResume.basics.location, 'region', parsedResume.basic_info?.location.region); } catch (error) { console.log(error); }
      try { set(defaultResume.basics.location, 'country', parsedResume.basic_info?.location.country); } catch (error) { console.log(error); }

      try {
        set(defaultResume.sections, 'education.items', parsedResume.education?.map((item) => {
          return {
            "id": uuidv4(),
            "institution": item.institution,
            "major": item.majors,
            "degree": item.degree,
            "gpa": item.GPA,
            "date": {
              "start": item.start_date,
              "end": item.end_date
            },
            "region": item.location,
            "country": item.location
          }
        }));
      } catch (error) {
        console.log(error);
      }

      try {
        set(defaultResume.sections, 'recruiter_information.items', [{
          id: uuidv4(),
          agency_name: parsedResume.basic_info?.full_name,
          recruiter_name: parsedResume.basic_info?.full_name,
          recruiter_title: parsedResume.basic_info?.current_title,
          recruiter_email: parsedResume.basic_info?.email,
          recruiter_phone: parsedResume.basic_info?.phone_number,
        }]);
      } catch (error) { console.log(error); }

      try { set(defaultResume.sections, 'candidate_summary.item', parsedResume.basic_info?.summary_description); } catch (error) { console.log(error); }

      try {
        set(defaultResume.sections, 'work_experience.items', parsedResume.work_history?.map((item) => {
          return {
            id: uuidv4(),
            url: "",
            date: {
              end: item.positions[0]?.end_date,
              start: item.positions[0]?.start_date,
            },
            organization: item.organization,
            title: item.positions[0]?.title,
            summary: item.positions[0]?.responsibilities[0],
            location: item.location,
          }
        }));
      } catch (error) { console.log(error); }

      try { set(defaultResume.sections, 'skills.item', parsedResume.skills?.join(", ")); } catch (error) { console.log(error); }
      try { set(defaultResume.sections, 'activities.item', parsedResume.activities?.join(", ")); } catch (error) { console.log(error); }

      try {
        set(defaultResume.sections, 'references.items', parsedResume.references?.map((item) => {
          return {
            id: uuidv4(),
            name: item.name,
            title: item.title,
            organiztion: item.organization,
            location: item.location,
            phone: item.phone,
            email: item.email,
          }
        }));
      } catch (error) {
        console.log(error);
      }

      try {
        set(defaultResume.sections, 'certifications.items', parsedResume.certifications?.map((item) => {
          return {
            id: uuidv4(),
            name: item.title,
            issuer: item.organization,
            summary: "",
            date: item.year
          }
        }));
      } catch (error) {
        console.log(error);

      }

      try {
        set(defaultResume.sections, 'strengths.item', parsedResume.strength_areas?.join(", "));
      } catch (error) {
        console.log(error);
      }

      try {
        set(defaultResume.sections, 'awards.items', parsedResume.awards_honors?.map((item) => {
          return {
            id: uuidv4(),
            organization: item.organization,
            title: item.title,
            year: item.year
          }
        }));
      } catch (error) {
        console.log(error);
      }

      //set(defaultResume.sections, 'title_recruiter_information.items', parsedResume.activities?.join(", "));

      try { set(defaultResume.sections, 'cover_agency_name.item', parsedResume.basic_info?.full_name); } catch (error) { console.log(error); }
      try { set(defaultResume.sections, 'cover_recruiter_name.item', parsedResume.basic_info?.full_name); } catch (error) { console.log(error); }
      try { set(defaultResume.sections, 'cover_recruiter_title.item', parsedResume.basic_info?.current_title); } catch (error) { console.log(error); }
      try { set(defaultResume.sections, 'cover_recruiter_email.item', parsedResume.basic_info?.email); } catch (error) { console.log(error); }
      try { set(defaultResume.sections, 'cover_recruiter_phone.item', parsedResume.basic_info?.phone_number); } catch (error) { console.log(error); }
      try { set(defaultResume.sections, 'cover_candidate_summary.item', parsedResume.basic_info?.summary_description); } catch (error) { console.log(error); }

      //set(defaultResume.sections, 'cover_candidate_name.item', parsedResume.basic_info?.full_name);
      //set(defaultResume.sections, 'cover_candidate_email.item', parsedResume.activities?.join(", "));
      //set(defaultResume.sections, 'cover_candidate_phone.item', parsedResume.activities?.join(", "));
      //set(defaultResume.sections, 'cover_candidate_website.item', parsedResume.activities?.join(", "));

      try { set(defaultResume.sections, 'cover_current_organization.item', parsedResume.basic_info?.current_org); } catch (error) { console.log(error); }
      try { set(defaultResume.sections, 'cover_current_position.item', parsedResume.basic_info?.current_title); } catch (error) { console.log(error); }

      //set(defaultResume.sections, 'cover_current_salary.item', parsedResume.activities?.join(", "));
      //set(defaultResume.sections, 'cover_date_of_availability.item', parsedResume.activities?.join(", "));
      //set(defaultResume.sections, 'cover_target_income.item', parsedResume.activities?.join(", "));
      //set(defaultResume.sections, 'cover_work_visa_status.item', parsedResume.activities?.join(", "));

      dispatch(setResume(defaultResume));
      dispatch(setModalState({ modal: 'show-template-modal', state: { open: true } }));
    }
  }

  return (
    <>
      <UserLayout>
        {
          isLoading || isLoadingResumes ? <ScreenLoading />
            :
            <div className="flex flex-col py-5 gap-5">
              <div className="flex flex-row justify-between items-center">
                <h1>Saved Resumes</h1>
                <Button onClick={() => handleClick()} className="mt-5 block">Show Templates</Button>
              </div>
              <div className="flex flex-row flex-wrap gap-2">
                {resumes?.map((resume, i) =>
                  <PreResume key={i} handleOpen={handleOpen} resume={resume} handleDelete={handleDelete} />
                )}
              </div>
            </div>
        }
      </UserLayout >
    </>
  );
};

export default ResumeDetails;
