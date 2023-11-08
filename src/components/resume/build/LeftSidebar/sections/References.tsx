import Heading from "~/components/shared/Heading";
import ResumeInput from "~/components/shared/ResumeInput";

const References = () => {
    return(
        <>
            <Heading isEditable={true} isHideable={true}  path="sections.references" name="Awards & Honors"/>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ResumeInput label="Name" path="sections.references.items[0].name"  className="sm:col-span-2"/>
                <ResumeInput label="Title" path="sections.references.items[0].title"  className="sm:col-span-2"/>
                <ResumeInput label="Reference Oganization" path="sections.references.items[0].organization"  className="sm:col-span-2"/>
                <ResumeInput label="Location" path="sections.references.items[0].location"  className="sm:col-span-2"/>
                <ResumeInput label="Phone" path="sections.references.items[0].phone"  className="sm:col-span-2"/>
                <ResumeInput label="Email" path="sections.references.items[0].email"  className="sm:col-span-2"/>
            </div>
        </>
    )   
}

export default References;