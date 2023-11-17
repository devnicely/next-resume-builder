import { isEmpty, set } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/common/button";
import UserLayout from "~/components/layout/UserLayout";
import { emptyDefaultResume } from "~/constants";
import { Resume } from "~/schema";
import { ParsedResume } from "~/schema/parsedresume";
import { useAppDispatch } from "~/store/hooks";
import { setModalState } from "~/store/modal/modalSlice";
import { setResume } from "~/store/resume/resumeSlice";
import { api } from "~/utils/api";
import { v4 as uuidv4 } from 'uuid';
import JSON5 from 'json5'
import ScreenLoading from "~/components/common/ScreenLoading";

const ResumeDetails = () => {
  const router = useRouter();
  const { resumeId } = router.query;
  const dispatch = useAppDispatch();

  const { data, isError, isSuccess, isLoading } = api.resume.getResumeJsonFromGcloud.useQuery(
    { resumeId },
    { enabled: !!resumeId }
  );

  const handleClick = () => {
    const parsedResume: ParsedResume = JSON5.parse(data.json as string);
    let defaultResume: Resume = JSON.parse(JSON.stringify(emptyDefaultResume));

    // set resume content
    set(defaultResume.basics, 'email', parsedResume.basic_info?.email);
    set(defaultResume.basics, 'name', parsedResume.basic_info?.full_name);
    set(defaultResume.basics, 'phone', parsedResume.basic_info?.phone_number);
    set(defaultResume.basics, 'summary', parsedResume.basic_info?.summary_description);
    set(defaultResume.basics.location, 'address', parsedResume.basic_info?.location.address);
    set(defaultResume.basics.location, 'city', parsedResume.basic_info?.location.city);
    set(defaultResume.basics.location, 'postalCode', parsedResume.basic_info?.location.zip_code);
    set(defaultResume.basics.location, 'region', parsedResume.basic_info?.location.region);
    set(defaultResume.basics.location, 'country', parsedResume.basic_info?.location.country);
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

    set(defaultResume.sections, 'recruiter_information.items', [{
      id: uuidv4(),
      agency_name: parsedResume.basic_info?.full_name,
      recruiter_name: parsedResume.basic_info?.full_name,
      recruiter_title: parsedResume.basic_info?.current_title,
      recruiter_email: parsedResume.basic_info?.email,
      recruiter_phone: parsedResume.basic_info?.phone_number,
    }]);

    set(defaultResume.sections, 'candidate_summary.item', parsedResume.basic_info?.summary_description);
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

    set(defaultResume.sections, 'skills.item', parsedResume.skills?.join(", "));
    set(defaultResume.sections, 'activities.item', parsedResume.activities?.join(", "));

    //set(defaultResume.sections, 'references.items', parsedResume.activities?.join(", "));
    //set(defaultResume.sections, 'certifications.item', parsedResume.activities?.join(", "));
    //set(defaultResume.sections, 'strengths.item', parsedResume.activities?.join(", "));
    //set(defaultResume.sections, 'awards.items', parsedResume.activities?.join(", "));

    //set(defaultResume.sections, 'awartitle_recruiter_informationds.items', parsedResume.activities?.join(", "));
    set(defaultResume.sections, 'cover_agency_name.item', parsedResume.basic_info?.full_name);
    set(defaultResume.sections, 'cover_recruiter_name.item', parsedResume.basic_info?.full_name);
    set(defaultResume.sections, 'cover_recruiter_title.item', parsedResume.basic_info?.current_title);
    set(defaultResume.sections, 'cover_recruiter_email.item', parsedResume.basic_info?.email);
    set(defaultResume.sections, 'cover_recruiter_phone.item', parsedResume.basic_info?.phone_number);
    set(defaultResume.sections, 'cover_candidate_summary.item', parsedResume.basic_info?.summary_description);
    // set(defaultResume.sections, 'cover_candidate_name.item', parsedResume.basic_info?.full_name);
    //set(defaultResume.sections, 'cover_candidate_email.item', parsedResume.activities?.join(", "));
    //set(defaultResume.sections, 'cover_candidate_phone.item', parsedResume.activities?.join(", "));
    //set(defaultResume.sections, 'cover_candidate_website.item', parsedResume.activities?.join(", "));
    set(defaultResume.sections, 'cover_current_organization.item', parsedResume.basic_info?.current_org);
    set(defaultResume.sections, 'cover_current_position.item', parsedResume.basic_info?.current_title);
    //set(defaultResume.sections, 'cover_current_salary.item', parsedResume.activities?.join(", "));
    //set(defaultResume.sections, 'cover_date_of_availability.item', parsedResume.activities?.join(", "));
    //set(defaultResume.sections, 'cover_target_income.item', parsedResume.activities?.join(", "));
    //set(defaultResume.sections, 'cover_work_visa_status.item', parsedResume.activities?.join(", "));

    dispatch(setResume(defaultResume));
    dispatch(setModalState({ modal: 'show-template-modal', state: { open: true } }));
  }

  return (
    <>
      <UserLayout>
        {
          isLoading ? <ScreenLoading />
            :
            <>
              {JSON.stringify(data)}
              < div className="flex flex-row">
                <Button onClick={() => handleClick()} className="mt-5 block">Show Templates</Button>
              </div>
            </>
        }
      </UserLayout >
    </>
  );
};

export default ResumeDetails;
