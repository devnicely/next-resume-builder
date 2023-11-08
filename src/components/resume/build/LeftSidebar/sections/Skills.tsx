import Heading from "~/components/shared/Heading"
import ResumeInput from "~/components/shared/ResumeInput"

const Skills = () => {
    return (
        <>
            <Heading isEditable={true} isHideable={true} path="sections.skills" name="Skills" />
            <div className="grid grid-cols-1 gap-4">
                <ResumeInput type="textarea" label="Skills" path="sections.skills.item" />
            </div>
        </>
    )
}


export default Skills;