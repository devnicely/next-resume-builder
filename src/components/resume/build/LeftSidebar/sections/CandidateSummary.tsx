import Heading from "~/components/shared/Heading";
import ResumeInput from "~/components/shared/ResumeInput";

const CandidateSummary = () => {
    return (
        <>
            <Heading isEditable={true} isHideable={true} path="sections.candidate_summary" name="Candidate Summary" isEditable={true} />
            <div className="grid grid-cols-1 gap-4">
                <ResumeInput type="textarea" label="Summary" path="sections.candidate_summary.item"/>
            </div>
        </>
    )
}

export default CandidateSummary;