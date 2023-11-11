import Heading from "~/components/shared/Heading";
import ResumeInput from "~/components/shared/ResumeInput";

const Recruiter = () => {
    return(
        <>
            <Heading isEditable={true} isHideable={true}  path="sections.recruiter" name="Recruiter Information"/>
            <div className="grid grid-cols-1 gap-4">
                <ResumeInput label="Agency Name" path="sections.recruiter_information.items[0].agency_name"/>
                <ResumeInput label="Recruiter Name" path="sections.recruiter_information.items[0].recruiter_name"/>
                <ResumeInput label="Recruiter Title" path="sections.recruiter_information.items[0].recruiter_title"/>
                <ResumeInput label="Recruiter Email" path="sections.recruiter_information.items[0].recruiter_email"/>
                <ResumeInput label="Recruiter Phone" path="sections.recruiter_information.items[0].recruiter_phone"/>
            </div>
        </>
    )
};

export default Recruiter;