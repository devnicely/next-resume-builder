import Heading from "~/components/shared/Heading";

type Props = {
    path: `sections.${string}`,
}

const CoverSectionTitle: React.FC<Props> = ({path}) => {
    return(
        <Heading isEditable={true} isHideable={true}  path={path} name="Recruiter Information"/>
    )
    
}

export default CoverSectionTitle;