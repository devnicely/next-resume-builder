import { get, template } from "lodash";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { Checkbox } from "~/components/common/checkbox";
import { Label } from "~/components/common/label";
import { TemplateType } from "~/constants";
import { Resume } from "~/schema";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setResumeState } from "~/store/resume/resumeSlice";
import { api } from "~/utils/api";



const Cover = () => {
    const router = useRouter();

    const { type } = useAppSelector((state) => state.resume.present);
    let tempResume: Resume;

    const { slug } = router.query;
        const id: number = parseInt(slug);
        const {
            data: resume,
            isLoading,
            isSuccess,
            refetch
        } = api.template.getResumeById.useQuery({ id });

    const dispatch = useAppDispatch();
    const { hasCover, layout } = useAppSelector((state) => get(state.resume.present, 'metadata'));
    const isCover = useMemo(() => hasCover === 1, [hasCover]);

    
    const handleChange = () => {
        dispatch(setResumeState({ path: 'metadata.hasCover', value: isCover ? 0 : 1 }));
        dispatch(setResumeState({ path: 'metadata.layout', value: isCover ? [resume?.metadata.layout[1]] : [resume?.metadata.layout[0], resume?.metadata.layout[1]] }));
    }

    return (
        <div className="flex items-conter justify-between">
            <Label>Do you need a cover ?</Label>
            <Checkbox checked={isCover} onClick={() => handleChange()} />
        </div>
    )
}

export default Cover;