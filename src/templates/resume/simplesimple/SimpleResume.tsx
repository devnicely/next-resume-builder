import clsx from "clsx";
import { PageProps, getPhotoClassNames } from "~/utils/template";
import ReumeStyles from './../../resumetemplate/simple/Simple.module.scss';
import coverStyles from '../../covertemplate/simple/SimpleCoverSheet.module.scss';
import { useMemo } from "react";
import RecruitInfo from "../../resumetemplate/simple/widgets/RecruitInfo";
import { useAppSelector } from "~/store/hooks";
import { get, isEmpty } from "lodash";
import { getSectionById } from "../../sectionMap";
import ResumeSectionOne from "../../resumetemplate/simple/widgets/SectionOne";
import ResumeSection from "../../resumetemplate/simple/widgets/Section";
import CoverSection from "./cover-widgets/Section";

const SimpleResume: React.FC<PageProps> = ({ page }) => {
    const isFirstPage = useMemo(() => page === 0, [page]);
    const {layout: metaLayout, hasCover} = useAppSelector((state) => get(state.resume.present, 'metadata'));
    const layout: string[][] = metaLayout[page];
    const { ratio } = useAppSelector((state) => get(state.resume.present, 'metadata'));
    
    const { name, photo} = useAppSelector(
        (state) => state.resume.present.basics,
    );

    const logoTop = ratio * 3;
    const isHeaderPage = useMemo(() => page === (hasCover ? 1: 0), [hasCover, page]);
    const isCover = useMemo(() => hasCover === 1, [hasCover]);
    return (
        <>
            {isFirstPage && isCover &&
                <div className={coverStyles.page}>
                    <div className={clsx(coverStyles.container)}>
                        <div>
                            <div className="flex justify-center" style={{ marginTop: `${logoTop}px` }}>
                                {photo.visible && !isEmpty(photo.url) && (
                                    <img
                                        alt={name}
                                        src={photo.url}
                                        width={photo.filters.size}
                                        height={photo.filters.size}
                                        className={getPhotoClassNames(photo.filters)}
                                    />
                                )}
                            </div>
                            <div className={coverStyles.recruiter}>
                                {layout[0]?.map((key) => {
                                    return getSectionById(key, CoverSection)
                                })}
                            </div>
                        </div>
                        <div className="h-full">
                            {layout[1]?.map((key) => {
                                return getSectionById(key, CoverSection)
                            })}
                        </div>
                    </div>
                </div>
            }

            <div className={clsx([ReumeStyles.page])}>
                {isHeaderPage && <RecruitInfo />}
                <div className={ReumeStyles.container}>
                    <div className={clsx([ReumeStyles.sidebar])} style={{ flexBasis: `${ratio}%` }}>
                        {layout[1]?.map((key) => {
                            if (
                                key == "candidate_summary"
                                || key == "skills"
                                || key == "strengths"
                                || key == "activities"
                                || key == "certifications")
                                return getSectionById(key, ResumeSectionOne);
                            return getSectionById(key, ResumeSection)
                        })}
                    </div>

                    <div className={clsx(['styles.main'])} style={{ flexBasis: `${100 - ratio}%` }}>
                        {layout[0]?.map((key) => {
                            if (key == "candidate_summary"
                                || key == "skills"
                                || key == "strengths"
                                || key == "activities"
                                || key == "certifications")
                                return getSectionById(key, ResumeSectionOne);
                            return getSectionById(key, ResumeSection)
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SimpleResume;