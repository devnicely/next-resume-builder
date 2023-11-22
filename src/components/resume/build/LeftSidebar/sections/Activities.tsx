import Heading from "~/components/shared/Heading"
import ResumeInput from "~/components/shared/ResumeInput"

const Activities = () => {
    return(
        <>
            <Heading isEditable={true} isHideable={true} isUppercase={true} path="sections.activities" name="Activities" />
            <div className="grid grid-cols-1 gap-4">
                <ResumeInput type="textarea" label="Activities" path="sections.activities.item" />
            </div>
        </>
    )
}

export default Activities;