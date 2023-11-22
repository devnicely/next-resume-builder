import { cloneDeep, get } from "lodash";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Checkbox } from "~/components/common/checkbox";
import { Label } from "~/components/common/label";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setResumeState } from "~/store/resume/resumeSlice";
import { api } from "~/utils/api";


const Cover = () => {
    const router = useRouter();
    const { id } = router.query;
    
    const {
        data: resume,
        isLoading,
        isSuccess,
        refetch
    } = api.template.getResumeById.useQuery({ id: id as string });

    const dispatch = useAppDispatch();
    const { hasCover, layout } = useAppSelector((state) => get(state.resume.present, 'metadata'));
    const isCover = useMemo(() => hasCover === 1, [hasCover]);


    const handleChange = () => {
        dispatch(setResumeState({ path: 'metadata.hasCover', value: isCover ? 0 : 1 }));
        const layout = cloneDeep(resume?.metadata.layout ?? []);
        if (isCover) layout.shift()
        dispatch(setResumeState({ path: 'metadata.layout', value: layout }));
    }

    return (
        <div className="flex items-conter justify-between">
            <Label>Do you need a cover ?</Label>
            <Checkbox checked={isCover} onClick={() => handleChange()} />
        </div>
    )
}

export default Cover;