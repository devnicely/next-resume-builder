import { get } from "lodash";
import { Label } from "~/components/common/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/common/select";
import { Slider } from "~/components/common/slider";
import Heading from "~/components/shared/Heading";
import { FontType } from "~/constants";
import { Font, TypeCategory, TypeProperty, Typography as TypographyType } from "~/schema";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setResumeState } from "~/store/resume/resumeSlice";

type WidgetsProps = {
    label: string;
    category: TypeCategory;
<<<<<<< HEAD
}

const Widgets: React.FC<WidgetsProps> = ({ label, category }) => {
    const { family, size } = useAppSelector<TypographyType>((state) => get(state.resume.present, 'metadata.typography'));
=======
    defaultValue: number[],
}

const Widgets: React.FC<WidgetsProps> = ({ label, category, ...props }) => {
>>>>>>> main
    const dispatch = useAppDispatch();
    const onChangedFontSize = (property: TypeProperty, size: number[]) => {
        const fontsize: number = size[0] ?? 0;
        dispatch(
            setResumeState({
<<<<<<< HEAD
              path: `metadata.typography.${property}.${category}`,
              value: size,
            }),
          );
=======
                path: `metadata.typography.${property}.${category}`,
                value: size,
            }),
        );
>>>>>>> main
    }

    return (
        <>
            <Label>{label}</Label>
            <div className="flex flex-row">
                <div className="basis-1/2 px-3">
                    <Slider
                        min={12}
                        max={36}
                        step={1}
<<<<<<< HEAD
                        defaultValue={[16]}
=======
                        {...props}
>>>>>>> main
                        onValueChange={(value: number[]) => { onChangedFontSize('size', value) }}
                        className={"mt-2"} />
                    <div className="flex flex-row justify-between">
                        <Label className="mt-2 -ml-0.5 text-[11px]">12px</Label>
                        <Label className={"mt-2 -ml-0.5  text-[11px]"}>Font Size</Label>
                        <Label className={"mt-2 -mr-1.5 float-right  text-[11px]"}>36px</Label>
                    </div>
                </div>
                <div className="basis-1/2 px-1">
                    <Select onValueChange={(value: string) => { }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Font Family" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Lato">Lato</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    )
}

const Typography = () => {
<<<<<<< HEAD
    return(
        <>
            <Heading path="" name="Typography" />
            <Widgets label="Section" category={FontType.SECTION}/>
            <Widgets label="Subtitle" category={FontType.SUBTITLE}/>
            <Widgets label="Section" category={FontType.NORMALTEXT}/>
=======
    const { family, size } = useAppSelector<TypographyType>((state) => get(state.resume.present, 'metadata.typography'));
    const { text: fontSizeText, section: fontSizeSection, subtitle: fontSizeSubtitle } = size;
    return (
        <>
            <Heading path="" name="Typography" />
            <Widgets label="Section" category={FontType.SECTION} defaultValue={[fontSizeSection]} />
            <Widgets label="Subtitle" category={FontType.SUBTITLE} defaultValue={[fontSizeSubtitle]} />
            <Widgets label="Section" category={FontType.NORMALTEXT} defaultValue={[fontSizeText]} />
>>>>>>> main
        </>
    )
}
export default Typography;

