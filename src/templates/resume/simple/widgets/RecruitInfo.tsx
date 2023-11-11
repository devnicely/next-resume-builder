import { Email, Phone } from "@mui/icons-material";
import { alpha } from "@mui/system";
import clsx from "clsx";
import { get, isEmpty } from "lodash";
import { RecruiterInformation } from "~/schema";
import { ThemeConfig } from "~/schema/metadata";
import { useAppSelector } from "~/store/hooks";
import DataDisplay from "~/templates/shared/DataDisplay";
import { getPhotoClassNames } from "~/utils/template";

const RecruitInfo: React.FC = () => {
    const { name, photo, headline, summary, email, phone, birthdate, website, location, profiles } = useAppSelector(
        (state) => state.resume.present.basics,
    );

    const { items } = useAppSelector(
        (state) => get(state.resume.present, 'sections.recruiter_information')
    );
    
    const recruiter_information: RecruiterInformation = items[0] as RecruiterInformation;
    const {agency_name, recruiter_email, recruiter_name, recruiter_phone, recruiter_title} = recruiter_information;

    const theme: ThemeConfig = useAppSelector((state) => get(state.resume.present, 'metadata.theme', {} as ThemeConfig));

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
                    <div className={clsx("grid gap-3", {invert: true})}>
                        <h2>{agency_name}</h2>
                        <h3>{recruiter_name}</h3>
                    </div>
                </div>

                <div className="grid grid-rows-2 items-center">
                    <h3 className={clsx({invert: true})}>{recruiter_title}</h3>
                    <div className="grid grid-rows-2">
                        <DataDisplay icon={<span className={clsx({invert: true})}>Email: </span>} textClassName={clsx({invert: true})} link={`mailto:${email}`}>
                            {recruiter_email}
                        </DataDisplay>
                        <DataDisplay icon={<span className={clsx({invert: true})}>Phone: </span>} textClassName={clsx({invert: true})} link={`tel:${recruiter_phone}`}>
                            {recruiter_phone}
                        </DataDisplay>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecruitInfo;