import { alpha } from "@mui/system";
import clsx from "clsx";
import { get, isEmpty } from "lodash";
import { RecruiterInformation, SectionType } from "~/schema";
import { Metadata, ThemeConfig } from "~/schema/metadata";
import { useAppSelector } from "~/store/hooks";
import DataDisplay from "~/templates/shared/DataDisplay";
import { getPhotoClassNames } from "~/utils/template";

const RecruitInfo: React.FC = () => {

    const { name, photo } = useAppSelector(
        (state) => state.resume.present.basics,
    );

    const { items, visible } = useAppSelector(
        (state) => get(state.resume.present, 'sections.recruiter_information')
    );
    
    const recruiter_information: RecruiterInformation = items[0] as RecruiterInformation;
    const {agency_name, recruiter_email, recruiter_name, recruiter_phone, recruiter_title} = recruiter_information;

    const metadata: Metadata  = useAppSelector((state) => get(state.resume.present, 'metadata', {} as Metadata));
    const theme: ThemeConfig = metadata.theme;
    
    const {section: fontSizeSection, subtitle: fontSizeSubTitle, text: fontSizeText} = metadata.typography.size;
    const {section: fontFamilySection, subtitle: fontFamilySubTitle, text: fontFamilyText} = metadata.typography.family;
    const {section: fontSpacingSection, subtitle: fontSpacingSubTitle, text: fontSpacingText} = metadata.typography.spacing;
    //if (!visible) return null;

    return (
        <div>
            <div className={clsx("grid grid-cols-2 gap-2 p-4")} style={{ backgroundColor: alpha(theme.primary, 0.9) }}>
                <div className="flex items-center gap-3">
                    {photo.visible && !isEmpty(photo.url) && (
                        <img
                            alt={name}
                            src={photo.url}
                            width={photo.filters.size}
                            height={photo.filters.size}
                            className={getPhotoClassNames(photo.filters)}
                        />
                    )}
                    <div className={clsx("grid gap-3", {invert: true, 'hidden': !visible})}>
                        <h2 style={{fontSize: `${fontSizeSection}pt`, lineHeight: fontSpacingSection}}>{agency_name}</h2>
                        <h3 style={{fontSize: `${fontSizeSubTitle}pt`, lineHeight: fontSpacingSubTitle}}>{recruiter_name}</h3>
                    </div>
                </div>

                <div className={clsx("grid grid-rows-2 items-center", {'hidden': !visible})}>
                    <h3 style={{fontSize: `${fontSizeSubTitle}pt`, lineHeight: fontSpacingSubTitle}} className={clsx({invert: true})}>{recruiter_title}</h3>
                    <div className="grid grid-rows-2">
                        <DataDisplay fontSize={`${fontSizeText}pt`} lineHeight={fontSpacingText} icon={<span className={clsx({invert: true})}>Email: </span>} textClassName={clsx({invert: true})} link={`mailto:${recruiter_email}`}>
                            {recruiter_email}
                        </DataDisplay>
                        <DataDisplay fontSize={`${fontSizeText}pt`} lineHeight={fontSpacingText} icon={<span className={clsx({invert: true})}>Phone: </span>} textClassName={clsx({invert: true})} link={`tel:${recruiter_phone}`}>
                            {recruiter_phone}
                        </DataDisplay>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecruitInfo;