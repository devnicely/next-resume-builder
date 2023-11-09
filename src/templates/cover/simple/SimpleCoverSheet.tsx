import { useAppSelector } from "~/store/hooks";
import { PageProps } from "~/utils/template";
import styles from './SimpleCoverSheet.module.scss';
import { getSectionById } from "~/templates/sectionMap";
import Section from "./widgets/Section";

const SimpleCoverSheet: React.FC<PageProps> = ({page}) => {
    const layout: string[][] = useAppSelector((state) => state.resume.present.metadata.layout[page]);
    return(
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                {layout[1]?.map((key) => {
                        return getSectionById(key, Section)
                    })}
                </div>

                <div className={styles.main}>
                    {layout[0]?.map((key) => {
                        return getSectionById(key, Section)
                    })}
                </div>
            </div>
        </div>
    )
}
export default SimpleCoverSheet;