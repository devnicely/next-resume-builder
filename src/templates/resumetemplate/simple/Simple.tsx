import { useEffect, useMemo, useState } from "react";
import { PageProps } from "~/utils/template";
import styles from './simple.module.scss';
import RecruitInfo from "./widgets/RecruitInfo";
import { useAppSelector } from "~/store/hooks";
import Section from "./widgets/Section";
import { getSectionById } from '../../sectionMap';
import SectionOne from "./widgets/SectionOne";
import clsx from "clsx";
import { get } from "lodash";

const getServerSideProps = () => { };

const Simple: React.FC<PageProps> = ({ page }) => {
    const isFirstPage = useMemo(() => page === 0, [page]);
    const layout: string[][] = useAppSelector((state) => state.resume.present.metadata.layout[page]);

    const {ratio} = useAppSelector((state) => get(state.resume.present, 'metadata'));

    return (
        <div style={!isFirstPage ? {paddingTop: '50px'} : {paddingTop: '0'}} className={clsx([styles.page])}>
            {isFirstPage && <RecruitInfo />}
            <div className={styles.container}>
                <div className={clsx([styles.sidebar])} style={{flexBasis: `${ratio}%`}}>
                    {layout[1]?.map((key) => {
                        if (
                            key == "candidate_summary"
                            || key == "skills"
                            || key == "strengths"
                            || key == "activities"
                            || key == "certifications")
                            return getSectionById(key, SectionOne);
                        return getSectionById(key, Section)
                    })}
                </div>

                <div className={clsx(['styles.main'])} style={{flexBasis: `${100 - ratio}%`}}>
                    {layout[0]?.map((key) => {
                        if (key == "candidate_summary"
                            || key == "skills"
                            || key == "strengths"
                            || key == "activities"
                            || key == "certifications")
                            return getSectionById(key, SectionOne);
                        return getSectionById(key, Section)
                    })}
                </div>
            </div>
        </div>
    )
};

export default Simple;