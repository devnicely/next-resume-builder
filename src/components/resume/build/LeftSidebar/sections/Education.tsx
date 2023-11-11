import Heading from "~/components/shared/Heading"
import ResumeInput from "~/components/shared/ResumeInput"

const Education = () => {
    return(
        <>
            <Heading isEditable={true} isHideable={true}  path="sections.education" name="Education"/>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ResumeInput label="Institution" path="sections.education.items[0].institution" className="sm:col-span-2"/>
                <ResumeInput label="Major" path="sections.education.items[0].major" className="sm:col-span-2"/>
                <ResumeInput label="Degree" path="sections.education.items[0].degree" className="sm:col-span-2"/>
                <ResumeInput label="GPA" path="sections.education.items[0].gpa" className="sm:col-span-2"/>
                <ResumeInput type="date" label="Start Date" path="sections.education.items[0].date.start" className="sm:col-span-1"/>
                <ResumeInput type="date" label="Start Date" path="sections.education.items[0].date.end" className="sm:col-span-1"/>
                <ResumeInput label="Region" path="sections.education.items[0].region" className="sm:col-span-1"/>
                <ResumeInput label="Country" path="sections.education.items[0].country" className="sm:col-span-1"/>
            </div>
        </>
    )
}

export default Education;