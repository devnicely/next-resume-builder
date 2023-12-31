import { stat } from "fs";
import { get } from "lodash";
import { Label } from "~/components/common/label";
import ColorPicker from "~/components/shared/ColorPicker";
import Heading from "~/components/shared/Heading"
import { FontType } from "~/constants";
import { TypeCategory } from "~/schema";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setResumeState } from "~/store/resume/resumeSlice";

type ColorWidgetsProps = {
    label: string;
    category: TypeCategory;
    path: string;
}

const ColorWidgets: React.FC<ColorWidgetsProps> = ({ label, category, path }) => {  
    const text = '#000000';
    const background = '#ffffff';
    const primary = '#f44336';
    
    const dispatch = useAppDispatch();
    
    const color = useAppSelector((state) => get(state.resume.present, `${path}.${category}`)) ?? primary;

    const handleChange = (category: string, color: string) => {
        dispatch(setResumeState({
            path: `${path}.${category}`,
            value: color,
        }))
    }

    return (
        <>
            <div className="flex">
                <ColorPicker
                    label={label}
                    color={color}
                    className="flex-1"
                    onChange={(color) => handleChange(category, color)}
                />
            </div>
        </>
    )
}

const ColorTone = () => {
    return (
        <>
            <Heading path="" name="Color Tone" />
            <ColorWidgets path="metadata.typography.color" label="Section" category={FontType.SECTION} />
            <ColorWidgets path="metadata.typography.color" label="Subtitle" category={FontType.SUBTITLE} />
            <ColorWidgets path="metadata.typography.color" label="Normal text" category={FontType.NORMALTEXT} />
        </>
    )
}

export default ColorTone;