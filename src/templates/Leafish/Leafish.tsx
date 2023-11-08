import { useMemo } from "react";
import { PageProps } from "~/utils/template";
import styles from './Leafish.module.scss';
import Masthead from "./widgets/Masthead";
import RecruitInfo from "./widgets/RecruitInfo";
import { useAppSelector } from "~/store/hooks";
import Section from "./widgets/Section";
import { getSectionById } from '../sectionMap';
import SectionOne from "./widgets/SectionOne";

const getServerSideProps = () => {

};

const Leafish: React.FC<PageProps> = ({ page }) => {
    const isFirstPage = useMemo(() => page === 0, [page]);
    const layout: string[][] = useAppSelector((state) => state.resume.present.metadata.layout[page]);
    console.log(layout);
    
    return (
        <div className={styles.page}>
            {isFirstPage && <RecruitInfo />}
            <div className={styles.container}>
                <div className={styles.sidebar}>
                {layout[1]?.map((key) => {
                        if(key == "candidate_summary" || key == "skills" || key == "strengths")
                            return getSectionById(key, SectionOne);
                        return getSectionById(key, Section)
                    })}
                </div>
                
                <div className={styles.main}>
                    {layout[0]?.map((key) => {
                        if(key == "candidate_summary" || key == "skills" || key == "strengths")
                            return getSectionById(key, SectionOne);
                        return getSectionById(key, Section)
                    })}
                </div>
            </div>
        </div>
    )
};


export default Leafish;