import clsx from "clsx";
import Heading from "~/components/shared/Heading";

type Props = {
    path: `sections.${string}`,
}

const CoverSectionTitle: React.FC<Props> = ({ path }) => {
    return (
        <>
            <h1 className={clsx("text-[#ffd0b9]", {'hidden' : path == "sections.title_candidate_information"})}>Cover Sheet</h1>
            <Heading isEditable={true} isHideable={true} path={path} name="Recruiter Information" />
        </>
    )
}

export default CoverSectionTitle;