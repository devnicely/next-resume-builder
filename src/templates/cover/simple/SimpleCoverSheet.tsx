import { useAppSelector } from "~/store/hooks";
import { PageProps } from "~/utils/template";
import styles from './SimpleCoverSheet.module.scss';
import { getSectionById } from "~/templates/sectionMap";
import Section from "./widgets/Section";
import { cn } from "~/utils/styles";
import { get } from "lodash";
import { Metadata } from "~/schema";
import { useEffect, useState } from "react";
import clsx from "clsx";

type Frame = {
    logoTop: number,
};


const SimpleCoverSheet: React.FC<PageProps> = ({ page }) => {
    const layout: string[][] = useAppSelector((state) => state.resume.present.metadata.layout[page]);
    const metadata: Metadata = useAppSelector((state) => get(state.resume.present, 'metadata', {} as Metadata));
    const {ratio} = metadata;
    const [frame, setFrame] = useState<Frame>({
        logoTop: 7
    });
    useEffect(() => {
        setFrame({
            logoTop: ratio * 3,
        })
    }, [ratio])
    const {logoTop} = frame;
    return (
        <div className={styles.page}>
            <div className={cn(styles.container, 'h-full')}>
                <div>
                    <div>
                        <div className="flex justify-center" style={{marginTop: `${logoTop}px`}}>
                            <img className="flex-basis w-[20%]" src="/images/logo/logo.png" alt="logo" />
                        </div>
                        <div className={styles.recruiter}>
                            {layout[0]?.map((key) => {
                                return getSectionById(key, Section)
                            })}
                        </div>
                    </div>
                </div>
                <div>
                    {layout[1]?.map((key) => {
                        return getSectionById(key, Section)
                    })}
                </div>
            </div>
        </div>
    )
}
export default SimpleCoverSheet;