import { get } from "lodash";
import Heading from "~/components/shared/Heading"
import ResumeInput from "~/components/shared/ResumeInput"
import { useAppSelector } from "~/store/hooks";


type Props = {
    i: number;
}

const EducationWidget: React.FC<Props> = ({ i }) => {
    return (
        <>
            <h6 className='text-[#35818E] text-xs'>Education ({i + 1})</h6>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ResumeInput label="Institution" path={`sections.education.items[${i}].institution`} className="sm:col-span-2" />
                <ResumeInput label="Major" path={`sections.education.items[${i}].major`} className="sm:col-span-2" />
                <ResumeInput label="Degree" path={`sections.education.items[${i}].degree`} className="sm:col-span-2" />
                <ResumeInput label="GPA" path={`sections.education.items[${i}].gpa`} className="sm:col-span-2" />
                <ResumeInput type="date" label="Start Date" path={`sections.education.items[${i}].date.start`} className="sm:col-span-1" />
                <ResumeInput type="date" label="End Date" path={`sections.education.items[${i}].date.end`} className="sm:col-span-1" />
                <ResumeInput label="Region" path={`sections.education.items[${i}].region`} className="sm:col-span-1" />
                <ResumeInput label="Country" path={`sections.education.items[${i}].country`} className="sm:col-span-1" />
            </div>
        </>
    )
}


const Education = () => {
    const education = useAppSelector((state) => get(state.resume.present, 'sections.education'));
    const sections = education.items.map((_, index) => <EducationWidget key={index} i={index} />)
    return (
        <>
            <Heading isEditable={true} isHideable={true} isUppercase={true} path="sections.education" name="Education" />
            {sections}
        </>
    )
}

export default Education;