import { get } from "lodash";
import { Label } from "~/components/common/label";
import { Slider } from "~/components/common/slider";
import { TemplateType } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { changeRatio } from "~/store/resume/resumeSlice";

const SidebarMain = () => {
    const dispatch = useAppDispatch();
    const type = useAppSelector((state) => get(state.resume.present, 'type'));

    const handleChangeSize = (value: number[]) => {
        const ratio: number = value[0] ?? 40;
        dispatch(changeRatio(ratio));
    }
    return (
        <div className="mx-2">
            {type == TemplateType.RESUME && <Label>Sidebar : Main</Label>}
            {type == TemplateType.COVER && <Label>Recruiter Info : Candidate Info</Label>}
            <Slider
                min={0}
                max={100}
                step={1}
                defaultValue={[50]}
                onValueChange={(value: number[]) => handleChangeSize(value)}
                className={"mt-2"} />
            <div className="flex flex-row justify-between">
                <Label className={"mt-2 -ml-0.5"}>0%</Label>
                <Label className={"mt-2 -ml-0.5"}>50%</Label>
                <Label className={"mt-2 -mr-1.5 float-right"}>100%</Label>
            </div>

        </div>
    )
}

export default SidebarMain;