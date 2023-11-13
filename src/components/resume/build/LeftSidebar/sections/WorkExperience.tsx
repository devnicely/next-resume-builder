import Heading from "~/components/shared/Heading";
import ResumeInput from "~/components/shared/ResumeInput";

const WorkExperience = () => {
    return(
        <>
            <Heading isEditable={true} isHideable={true}  path="sections.work_experience" name="Work Experience"/>
            <div className="grid grid-cols-1 gap-4">
                <ResumeInput label="Organiztion" path="sections.work_experience.items[0].organization"/>
                <ResumeInput label="Title" path="sections.work_experience.items[0].title"/>
                <ResumeInput label="Start Date" path="sections.work_experience.items[0].date.start"/>
                <ResumeInput label="End Date" path="sections.work_experience.items[0].date.end"/>
                <ResumeInput label="Location" path="sections.work_experience.items[0].location"/>
                <ResumeInput type="textarea" label="Responsibilities" path="sections.work_experience.items[0].summary"/>
            </div>
        </>
    )
};

export default WorkExperience;