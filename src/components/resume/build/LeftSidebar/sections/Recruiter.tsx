import Heading from "~/components/shared/Heading";
import ResumeInput from "~/components/shared/ResumeInput";

const Recruiter = () => {
    return (
        <>
            <h1 className="text-[#ffd0b9]">Resume</h1>
            <Heading isEditable={true} isHideable={true} isUppercase={true} path="sections.recruiter_information" name="Recruiter Information" />
            <div className="grid grid-cols-1 gap-4">
                <ResumeInput label="Agency Name" path="sections.recruiter_information.items[0].agency_name" />
                <ResumeInput label="Recruiter Name" path="sections.recruiter_information.items[0].recruiter_name" />
                <ResumeInput label="Recruiter Title" path="sections.recruiter_information.items[0].recruiter_title" />
                <ResumeInput label="Recruiter Email" path="sections.recruiter_information.items[0].recruiter_email" />
                <ResumeInput label="Recruiter Phone" path="sections.recruiter_information.items[0].recruiter_phone" />
            </div>
        </>
    )
};

export default Recruiter;