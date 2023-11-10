import { useAppSelector } from "~/store/hooks";
import { PageProps } from "~/utils/template";
import styles from './SimpleCoverSheet.module.scss';
import { getSectionById } from "~/templates/sectionMap";
import Section from "./widgets/Section";

const SimpleCoverSheet: React.FC<PageProps> = ({ page }) => {
    const layout: string[][] = useAppSelector((state) => state.resume.present.metadata.layout[page]);

    
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className="flex justify-center mt-[7%]">
                    <img className="flex-basis w-[20%]"  src="/images/logo/logo.png" alt="logo" />
                </div>
                
                <div className={styles.recruiter}>
                    {layout[0]?.map((key) => {
                        return getSectionById(key, Section)
                    })}
                </div>

                <div className={styles.candidate}>
                    {layout[1]?.map((key) => {
                        return getSectionById(key, Section)
                    })}
                </div>
            </div>
        </div>
    )
}
export default SimpleCoverSheet;