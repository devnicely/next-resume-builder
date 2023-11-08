import Heading from "~/components/shared/Heading"
import ResumeInput from "~/components/shared/ResumeInput"

const Strengths = () => {
    return (
        <>
            <Heading isEditable={true} isHideable={true} path="sections.strengths" name="Strengths"/>
            <div className="grid grid-cols-1 gap-4">
                <ResumeInput type="textarea" label="Skills" path="sections.strengths.item" />
            </div>
        </>
    )
}


export default Strengths;