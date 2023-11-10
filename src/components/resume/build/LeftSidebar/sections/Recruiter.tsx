import Heading from "~/components/shared/Heading";
import ResumeInput from "~/components/shared/ResumeInput";

const Recruiter = () => {
    return(
        <>
            <Heading isEditable={true} isHideable={true}  path="sections.recruiter" name="Recruiter Information"/>
            <div className="grid grid-cols-1 gap-4">
                <ResumeInput label="Agency Name" path="recruiter.agency_name"/>
                <ResumeInput label="Recruiter Name" path="recruiter.recruiter_name"/>
                <ResumeInput label="Recruiter Title" path="recruiter.recruiter_title"/>
                <ResumeInput label="Recruiter Email" path="recruiter.recruiter_email"/>
                <ResumeInput label="Recruiter Phone" path="recruiter.recruiter_phone"/>
            </div>
        </>
    )
};

export default Recruiter;