import Heading from "~/components/shared/Heading"
import ResumeInput from "~/components/shared/ResumeInput"

const Awards = () => {
    return(
        <>
            <Heading isEditable={true} isHideable={true}  path="sections.awards" name="Awards & Honors"/>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ResumeInput label="Organiztion" path="sections.awards.items[0].organization"  className="sm:col-span-2"/>
                <ResumeInput label="Title" path="sections.awards.items[0].title" className="sm:col-span-1"/>
                <ResumeInput type="year" label="Year" path="sections.awards.items[0].date.start"  className="sm:col-span-1"/>
            </div>
        </>
    )   
}


export default Awards;