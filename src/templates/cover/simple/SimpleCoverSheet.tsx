import { useAppSelector } from "~/store/hooks";
import { PageProps, getPhotoClassNames } from "~/utils/template";
import styles from './SimpleCoverSheet.module.scss';
import { getSectionById } from "~/templates/sectionMap";
import Section from "./widgets/Section";
import { cn } from "~/utils/styles";
import { get, isEmpty } from "lodash";
import { Metadata, Resume } from "~/schema";
import { useEffect, useState } from "react";

type Frame = {
    logoTop: number,
};

const SimpleCoverSheet: React.FC<PageProps> = ({ page }) => {
    const layout: string[][] = useAppSelector((state) => state.resume.present.metadata.layout[page]);
    const metadata: Metadata = useAppSelector((state) => get(state.resume.present, 'metadata', {} as Metadata));
    const resume: Resume = useAppSelector((state) => state.resume.present);
    const id: number = resume.id;
    const { name, photo} = useAppSelector(
        (state) => state.resume.present.basics,
    );
    const { ratio } = metadata;
    const [frame, setFrame] = useState<Frame>({
        logoTop: 7
    });
    useEffect(() => {
        setFrame({
            logoTop: ratio * 3,
        })
    }, [ratio])
    const { logoTop } = frame;
    return (
        <div className={styles.page}>
            <div className={cn(styles.container)}>
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
                    <div className={styles.recruiter}>
                        {layout[0]?.map((key) => {
                            return getSectionById(key, Section)
                        })}
                    </div>
                </div>
                <div className="h-full">
                    {layout[1]?.map((key) => {
                        return getSectionById(key, Section)
                    })}
                </div>
            </div>
        </div>
    )
}
export default SimpleCoverSheet;