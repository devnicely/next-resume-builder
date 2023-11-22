import React from "react";
import ResumeInput from "~/components/shared/ResumeInput";

type Props = {
    path: `sections.${string}`;
    name: string;
    type?: string;
}

const CoverInputSection: React.FC<Props> = ({ path, name, type }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {
                type == 'textarea' ?  <ResumeInput type="textarea" label={name} path={`${path}.item`} />
                 : type == 'date' ? <ResumeInput type="date" label={name} path={`${path}.item`} /> 
                 : <ResumeInput label={name} path={`${path}.item`} />
        
            }
        </div>

    )
}

export default CoverInputSection;