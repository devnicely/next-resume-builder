import { get } from "lodash";
import { useEffect, useState } from "react";
import { Label } from "~/components/common/label";
import { Slider } from "~/components/common/slider";
import { TemplateType } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { changeRatio } from "~/store/resume/resumeSlice";

const SidebarMain = () => {
    
    const {metadata} = useAppSelector((state) => state.resume.present);
    const dispatch = useAppDispatch();
    const type = useAppSelector((state) => get(state.resume.present, 'type'));
    const [sliderValue, setSliderValue] = useState(0);

    useEffect(() => {
        setSliderValue(metadata.ratio);
    }, []);

    const handleChangeSize = (value: number[]) => {
        const ratio: number = value[0] ?? 40;
        dispatch(changeRatio(ratio));
        setSliderValue(ratio);
    }
    
    return (
        <div className="mx-2">
            {type == TemplateType.RESUME_TEMPLATE && <Label>Sidebar : Main</Label>}
            {type == TemplateType.COVER_TEMPLATE && <Label>Recruiter Info : Candidate Info</Label>}
            <Label className="ms-1">({sliderValue.toFixed()})</Label>
            <Slider
                min={0}
                max={100}
                step={1}
                defaultValue={[50]}
                aria-labelledby="continuous-slider"
                value={[metadata.ratio]}
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