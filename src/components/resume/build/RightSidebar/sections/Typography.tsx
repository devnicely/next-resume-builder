import { get } from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Label } from "~/components/common/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/common/select";
import { Slider } from "~/components/common/slider";
import Heading from "~/components/shared/Heading";
import { FONTS_QUERY, FontType } from "~/constants";
import { Font, TypeCategory, TypeProperty, Typography as TypographyType } from "~/schema";
import { fetchFonts } from "~/services/fonts";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setResumeState } from "~/store/resume/resumeSlice";


type WidgetsProps = {
    label: string;
    category: TypeCategory;
    defaultValue: number[],
}

const Widgets: React.FC<WidgetsProps> =  ({ label, category, defaultValue, ...props }) => {

    const dispatch = useAppDispatch();
    const [size, setSize] = useState(0);
    const onChangedFontSize = (property: TypeProperty, size: number[]) => {
        const fontsize: number = size[0] ?? 0;
        setSize(fontsize);
        dispatch(
            setResumeState({
                path: `metadata.typography.${property}.${category}`,
                value: size,
            }),
        );
    }

    useEffect(() => { 
        setSize(defaultValue[0] ?? 0);
    }, []);

    const { data: fonts } = useQuery(FONTS_QUERY, fetchFonts, {
        select: (fonts) => fonts.sort((a, b) => a.category.localeCompare(b.category)),
    });
    
    const handleChangeFont = (property: TypeProperty, pos: string) => {
        const font: Font | undefined = Array.isArray(fonts) ? fonts[parseInt(pos)] : undefined;
        if (!font) return;
        dispatch(
          setResumeState({
            path: `metadata.typography.${property}.${category}`,
            value: (font as Font).family,
          }),
        );
      };

    return (
        <>
            <Label>{label} ({size.toFixed()})</Label>
            <div className="flex flex-row">
                <div className="basis-1/2 px-3">
                    <Slider
                        min={12}
                        max={36}
                        step={1}
                        {...props}
                        value={[size]}
                        onValueChange={(value: number[]) => { onChangedFontSize('size', value) }}
                        className={"mt-2"} />
                    <div className="flex flex-row justify-between">
                        <Label className="mt-2 -ml-0.5 text-[11px]">12px</Label>
                        <Label className={"mt-2 -ml-0.5  text-[11px]"}>Font Size</Label>
                        <Label className={"mt-2 -mr-1.5 float-right  text-[11px]"}>36px</Label>
                    </div>
                </div>
                <div className="basis-1/2 px-1">
                    <Select onValueChange={(value: string) => handleChangeFont('family', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Font Family" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {fonts?.map((font, i) => <SelectItem key={i} value={`${i}`}>{font.family}</SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    )
}

const Typography = () => {
    const { family, size } = useAppSelector<TypographyType>((state) => get(state.resume.present, 'metadata.typography'));
    const { text: fontSizeText, section: fontSizeSection, subtitle: fontSizeSubtitle } = size;
    return (
        <>
            <Heading path="" name="Typography" />
            <Widgets label="Section" category={FontType.SECTION} defaultValue={[fontSizeSection]} />
            <Widgets label="Subtitle" category={FontType.SUBTITLE} defaultValue={[fontSizeSubtitle]} />
            <Widgets label="Normal Text" category={FontType.NORMALTEXT} defaultValue={[fontSizeText]} />
        </>
    )
}
export default Typography;

