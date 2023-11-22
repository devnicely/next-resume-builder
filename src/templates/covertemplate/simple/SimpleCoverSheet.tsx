import { useAppSelector } from "~/store/hooks";
import { PageProps, getPhotoClassNames } from "~/utils/template";
import styles from './SimpleCoverSheet.module.scss';
import { getSectionById } from "~/templates/sectionMap";
import Section from "./widgets/Section";
import { cn } from "~/utils/styles";
import { get, isEmpty } from "lodash";
import { Metadata } from "~/schema";
import clsx from "clsx";

type Frame = {
    logoTop: number,
};

const SimpleCoverSheet: React.FC<PageProps> = ({ page }) => {

    const layout: string[][] = useAppSelector((state) => state.resume.present.metadata.layout[page]);
    const metadata: Metadata = useAppSelector((state) => get(state.resume.present, 'metadata', {} as Metadata));
    const { name, photo } = useAppSelector(
        (state) => state.resume.present.basics,
    );
    const { ratio } = metadata;

    const logoTop = ratio * 3;

    return (
        <div className={clsx(styles.page, 'h-full')}>
            <div className={cn(styles.container, 'h-full')}>
                <div className="flex flex-col">
                    <div className="flex flex-col" style={{height: `${ratio}%`}}>
                        <div className="grow"></div>
                        <div className="flex justify-center">
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
                        <div className={clsx(styles.recruiter, 'mb-10')}>
                            {layout[0]?.map((key) => {
                                return getSectionById(key, Section)
                            })}
                        </div>
                    </div>

                    <div className="grow">
                        {layout[1]?.map((key) => {
                            return getSectionById(key, Section)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SimpleCoverSheet;