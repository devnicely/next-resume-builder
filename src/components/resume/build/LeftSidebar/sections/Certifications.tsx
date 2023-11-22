import Heading from "~/components/shared/Heading";
import ResumeInput from "~/components/shared/ResumeInput";

const Certifications = () => {
    return(
        <>
            <Heading isEditable={true} isHideable={true} isUppercase={true} path="sections.certifications" name="Certifications"/>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ResumeInput type="textarea" label="Certifications" path="sections.certifications.item"  className="sm:col-span-2"/>
            </div>
        </>
    )
}

export default Certifications;