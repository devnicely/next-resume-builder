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

    if (!section.visible) return null;

    if (isEmpty(section.item)) return null;

    return (
        <section id={`Leafish_${sectionId}`}>
            <Heading>{section.name}</Heading>
            <div
                className="grid items-start"
                style={{ gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))` }}
            >
            </div>
        </section>
    )
}

export default Section;