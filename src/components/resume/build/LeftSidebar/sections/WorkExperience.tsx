import { get } from "lodash";
import Heading from "~/components/shared/Heading";
import ResumeInput from "~/components/shared/ResumeInput";
import { useAppSelector } from "~/store/hooks";

type Props = {
    i: number;
}

const WorkExperienceWidget: React.FC<Props> = ({ i }) => {
    return (
        <>
            <h6 className='text-[#35818E] text-xs'>Work Experience ({i + 1})</h6>
            <div className="grid grid-cols-1 gap-4">
                <ResumeInput label="Organiztion" path={`sections.work_experience.items[${i}].organization`} />
                <ResumeInput label="Title" path={`sections.work_experience.items[${i}].title`} />
                <ResumeInput type="date" label="Start Date" path={`sections.work_experience.items[${i}].date.start`} />
                <ResumeInput type="date" label="End Date" path={`sections.work_experience.items[${i}].date.end`} />
                <ResumeInput label="Location" path={`sections.work_experience.items[${i}].location`} />
                <ResumeInput type="textarea" label="Responsibilities" path={`sections.work_experience.items[${i}].summary`} />
            </div>
        </>
    )
}

const WorkExperience = () => {
    const work_experience = useAppSelector((state) => get(state.resume.present, 'sections.work_experience'));
    const renderSections = () => {
        return work_experience.items.map((_, index) => (
            <WorkExperienceWidget key={index} i={index} />
        ));
    };

    return (
        <>
            <Heading isEditable={true} isHideable={true} isUppercase={true} path="sections.work_experience" name="Work Experience" />
            {renderSections()}
        </>
    )
};

export default WorkExperience;