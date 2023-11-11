import { SectionProps } from "~/templates/sectionMap";
import { ListItem, Section as SectionType, Typography } from '~/schema';
import { useAppSelector } from "~/store/hooks";
import get from "lodash/get";
import { useMemo } from "react";
import { isArray, isEmpty } from "lodash";
import Heading from "./Heading";
import clsx from "clsx";
import { cn } from "~/utils/styles";


const Section: React.FC<SectionProps> = ({
    path,
    titlePath = 'title',
    subtitlePath = 'subtitle',
    headlinePath = 'headline',
    keywordsPath = 'keywords',
}) => {
    const section: SectionType = useAppSelector((state) => get(state.resume.present, path, {} as SectionType));
    const sectionId = useMemo(() => section.id || path.replace('sections.', ''), [path, section]);
    const resume = useAppSelector((state) => state.resume.present);
    const primaryColor: string = get(resume, 'metadata.theme.primary');
    const typography: Typography = get(resume, 'metadata.typography');

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
<<<<<<< HEAD
                        <div className="text-center py-3 text-white mb-3" style={{ background: primaryColor, fontSize: `${typography.size.section}pt` }}>{section.item}</div>
=======
                        <div className="text-center py-3 text-white mb-3" 
                        style={{ background: primaryColor, 
                            fontSize: `${typography.size.section}pt`,
                            lineHeight: typography.spacing.section
                        }}>{section.item}</div>
>>>>>>> main
                    }
                    {
                        (section.id == 'cover_recruiter_name'
                            || section.id == 'cover_recruiter_title'
                            || section.id == 'cover_recruiter_email'
                            || section.id == 'cover_recruiter_phone') &&
<<<<<<< HEAD
                        <div className="flex flex-row px-10 py-0 my-0" style={{fontSize: `${typography.size.subtitle}pt`}}>
=======
                        <div className="flex flex-row px-10 py-0 my-0" 
                        style={{fontSize: `${typography.size.subtitle}pt`, lineHeight: typography.spacing.subtitle}}>
>>>>>>> main
                            <div className="basis-1/3 py-3" style={{ color: primaryColor }}>{section.name}</div>
                            <div className="basis-2/3 border-l-4 pl-3 py-3" style={{ borderColor: primaryColor }}>{section.item}</div>
                        </div>
                    }
                    {
                        section.id == 'title_candidate_information' &&
<<<<<<< HEAD
                        <div className={clsx("text-center")} style={{color: typography.color.section, fontSize: `${typography.size.section}pt`}}>
=======
                        <div className={clsx("text-center")} 
                        style={{color: typography.color.section, 
                        fontSize: `${typography.size.section}pt`, lineHeight: typography.spacing.section}}>
>>>>>>> main
                            {section.name}
                        </div>
                    }

                    {
                        section.id == 'cover_candidate_summary' &&
<<<<<<< HEAD
                        <div className="text-center text-justify px-[30px] mt-[10px]" style={{color: typography.color.text,fontSize: `${typography.size.text}pt`}}>
=======
                        <div className="text-center text-justify px-[30px] mt-[10px]" 
                        style={{color: typography.color.text, 
                        fontSize: `${typography.size.text}pt`, lineHeight: typography.spacing.text}}>
>>>>>>> main
                            {section.item}
                        </div>
                    }

                    {
                        (section.id == 'cover_current_organization'
                            || section.id == 'cover_current_position'
                            || section.id == 'cover_current_salary')  &&
<<<<<<< HEAD
                        <div className="flex flex-row px-10 py-0" style={{fontSize: `${typography.size.subtitle}pt`}}>
=======
                        <div className="flex flex-row px-10 py-0" 
                        style={{fontSize: `${typography.size.subtitle}pt`, lineHeight: typography.spacing.subtitle}}>
>>>>>>> main
                            <div className="basis-1/3 py-1" style={{ color: typography.color.subtitle }}>{section.name}</div>
                            <div className="basis-2/3 border-l-4 pl-3 py-1" style={{ borderColor: primaryColor }}>{section.item}</div>
                        </div>
                    }

                    {
                        (section.id == 'cover_date_of_availability'
                            || section.id == 'cover_target_income'
                            || section.id == 'cover_work_visa_status')  &&
<<<<<<< HEAD
                        <div className="flex flex-row px-10" style={{fontSize: `${typography.size.subtitle}pt`}}>
=======
                        <div className="flex flex-row px-10" 
                        style={{fontSize: `${typography.size.subtitle}pt`, lineHeight: typography.spacing.subtitle}}>
>>>>>>> main
                            <div className="basis-1/3 py-1" style={{ color: typography.color.subtitle }}>{section.name}</div>
                            <div className="basis-2/3 border-l-4 pl-3 py-1" style={{ borderColor: primaryColor }}>{section.item}</div>
                        </div>
                    }
                </div>
            </div>
        </section>
    )
}

export default Section;