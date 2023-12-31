import Heading from "~/components/shared/Heading"
import ResumeInput from "~/components/shared/ResumeInput";

const CandidateInformation = () => {
    return(
        <>
            <Heading isEditable={true} isHideable={true} isUppercase={true}  path="sections.candidate_information" name="Candidate Information"/>
            <div className="grid grid-cols-1 gap-4">
                <ResumeInput label="Candidate Name" path="sections.candidate_information.items[0].candidate_name"/>
                <ResumeInput label="Candidate Email" path="sections.candidate_information.items[0].candidate_email"/>
                <ResumeInput label="Candidate Phone" path="sections.candidate_information.items[0].candidate_phone"/>
                <ResumeInput label="Candidate Website" path="sections.candidate_information.items[0].candidate_website"/>
            </div>
        </>        
    )
}

export default CandidateInformation;