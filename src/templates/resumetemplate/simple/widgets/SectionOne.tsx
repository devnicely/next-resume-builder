import get from "lodash/get";
import { useMemo } from "react";
import { ListItem, Metadata, Section } from "~/schema";
import { useAppSelector } from "~/store/hooks";
import { SectionProps } from "~/templates/sectionMap";
import Heading from "./Heading";
import Markdown from "~/components/shared/Markdown";
import { lineHeight } from "@mui/system";

const SectionOne: React.FC<SectionProps> = ({
    path,
    titlePath = 'title',
    headlinePath = 'subtitle',
    keywordsPath = 'keywords'
}) => {


    const metadata: Metadata = useAppSelector((state) => get(state.resume.present, 'metadata'));
    const section: Section = useAppSelector((state) => get(state.resume.present, path, {} as Section));
    const dateFormat: string = metadata.date.format;
    const primaryColor: string = metadata.theme.primary;
    const {text: spacingText} = metadata.typography.spacing;
    const {text: fontSizeText} = metadata.typography.size;
    const {text: colorText} = metadata.typography.color;


    const sectionId = useMemo(
        () => section.id || path.replace('sections.', ''),
        [path, section]);

    if (!section.visible) return null;
    if (!section.item) return null;

    const summary: string = section.item;

    return (
        <section id={`Leafish_${sectionId}`}>
            <Heading>{section.name}</Heading>
            <div
                className="grid items-start"
                style={{ gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))` }}
                >
                <div className="mb-2 grid gap-1">
                    <div className="grid gap-1" style={{lineHeight: spacingText, fontSize: `${fontSizeText}pt`, color: colorText}}>
                        {summary && <Markdown>{summary}</Markdown>}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionOne;