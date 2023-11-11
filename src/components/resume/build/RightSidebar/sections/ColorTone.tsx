<<<<<<< HEAD
import { Label } from "~/components/common/label";
=======
>>>>>>> main
import ColorPicker from "~/components/shared/ColorPicker";
import Heading from "~/components/shared/Heading"
import { FontType } from "~/constants";
import { TypeCategory } from "~/schema";
import { useAppDispatch } from "~/store/hooks";
<<<<<<< HEAD
import { setResume, setResumeState } from "~/store/resume/resumeSlice";
=======
import { setResumeState } from "~/store/resume/resumeSlice";
>>>>>>> main

type ColorWidgetsProps = {
    label: string;
    category: TypeCategory;
}

const ColorWidgets: React.FC<ColorWidgetsProps> = ({ label, category }) => {
    const text = '#000000';
    const background = '#ffffff';
    const primary = '#f44336';
    
    const dispatch = useAppDispatch();

    const handleChange = (category: string, color: string) => {
        dispatch(setResumeState({
            path: `metadata.typography.color.${category}`,
            value: color,
        }))
    }

    return (
        <>
            <div className="flex">
                <ColorPicker
                    label={label}
                    color={primary}
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
            <ColorWidgets label="Section" category={FontType.SECTION} />
            <ColorWidgets label="Subtitle" category={FontType.SUBTITLE} />
<<<<<<< HEAD
            <ColorWidgets label="Section" category={FontType.NORMALTEXT} />
=======
            <ColorWidgets label="Normal text" category={FontType.NORMALTEXT} />
>>>>>>> main
        </>
    )
}

export default ColorTone;