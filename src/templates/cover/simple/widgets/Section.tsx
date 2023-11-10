import { SectionProps } from "~/templates/sectionMap";
import { ListItem, Section as SectionType } from '~/schema';
import { useAppSelector } from "~/store/hooks";
import get from "lodash/get";
import { useMemo } from "react";
import { isArray, isEmpty } from "lodash";
import Heading from "./Heading";


const Section: React.FC<SectionProps> = ({
    path,
    titlePath = 'title',
    subtitlePath = 'subtitle',
    headlinePath = 'headline',
    keywordsPath = 'keywords',
}) => {
    const section: SectionType = useAppSelector((state) => get(state.resume.present, path, {} as SectionType));
    const sectionId = useMemo(() => section.id || path.replace('sections.', ''), [path, section]);
    const primaryColor: string = useAppSelector((state) => get(state.resume.present, 'metadata.theme.primary'))

    if (!section.visible) return null;
    if (isEmpty(section.item)) return null;
    
    return (
        <section id={`Leafish_${sectionId}`}>
            <div
                className="grid items-start"
                style={{ gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))` }}
            >
                <div className="grid">
                    {
                        section.id == 'cover_agency_name' &&
                        <div className="text-center py-3 text-white text-[30px] mb-10" style={{ background: primaryColor }}>{section.item}</div>
                    }
                    {
                        (section.id == 'cover_recruiter_name'
                            || section.id == 'cover_recruiter_title'
                            || section.id == 'cover_recruiter_email'
                            || section.id == 'cover_recruiter_phone') &&
                        <div className="flex flex-row px-10 text-[20px] py-0 my-0">
                            <div className="basis-1/3 py-3" style={{ color: primaryColor }}>{section.name}</div>
                            <div className="basis-2/3 border-l-4 pl-3 py-3" style={{ borderColor: primaryColor }}>{section.item}</div>
                        </div>
                    }
                    {
                        section.id == 'title_candidate_information' &&
                        <div className="text-center text-[30px]" style={{color: primaryColor}}>
                            {section.name}
                        </div>
                    }

                    {
                        section.id == 'cover_candidate_summary' &&
                        <div className="text-center text-justify px-[30px] mt-[20px]">
                            {section.item}
                        </div>
                    }

                    {
                        (section.id == 'cover_current_organization'
                            || section.id == 'cover_current_position'
                            || section.id == 'cover_current_salary')  &&
                        <div className="flex flex-row px-10 text-[20px] py-0">
                            <div className="basis-1/3 py-1" style={{ color: primaryColor }}>{section.name}</div>
                            <div className="basis-2/3 border-l-4 pl-3 py-1" style={{ borderColor: primaryColor }}>{section.item}</div>
                        </div>
                    }

                    {
                        (section.id == 'cover_date_of_availability'
                            || section.id == 'cover_target_income'
                            || section.id == 'cover_work_visa_status')  &&
                        <div className="flex flex-row px-10 text-[20px]">
                            <div className="basis-1/3 py-1" style={{ color: primaryColor }}>{section.name}</div>
                            <div className="basis-2/3 border-l-4 pl-3 py-1" style={{ borderColor: primaryColor }}>{section.item}</div>
                        </div>
                    }
                </div>
            </div>
        </section>
    )
}

export default Section;