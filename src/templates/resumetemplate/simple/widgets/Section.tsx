import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import { useMemo } from 'react';
import { ListItem, Metadata, Section as SectionType } from '~/schema';
import { v4 as uuidv4 } from 'uuid';
import Markdown from '~/components/shared/Markdown';
import { useAppSelector } from '~/store/hooks';
import { SectionProps } from '~/templates/sectionMap';
import DataDisplay from '~/templates/shared/DataDisplay';
import { formatDateString } from '~/utils/date';
import { parseListItemPath } from '~/utils/template';

import Heading from './Heading';

const Section: React.FC<SectionProps> = ({
  path,
  titlePath = 'title',
  subtitlePath = 'subtitle',
  headlinePath = 'headline',
  keywordsPath = 'keywords',
  separator = ', ',
  
}) => {
  const section: SectionType = useAppSelector((state) => get(state.resume.present, path, {} as SectionType));
  const metadata: Metadata = useAppSelector((state) => get(state.resume.present, 'metadata'));
  const dateFormat: string = metadata.date.format;
  const primaryColor: string = metadata.theme.primary;
  const spacing = metadata.typography.spacing;
  const {subtitle: spacingSubtitle, text: spacingText} = spacing;
  const {text: fontSizeText, section: fontSizeSection, subtitle: fontSizeSubtitle} = metadata.typography.size;
  const {text: colorText, section: colorSection, subtitle: colorSubtitle} = metadata.typography.color;

  
  const sectionId = useMemo(() => section.id || path.replace('sections.', ''), [path, section]);

  if (!section.visible) return null;

  if (isArray(section.items) && isEmpty(section.items)) return null;

  return (
    <section id={`Leafish_${sectionId}`}>
      <Heading>{section.name}</Heading>
      <div
        className="grid items-start"
        style={{ gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))` }}
      >
        {section.items.map((item: ListItem) => {
          const id = uuidv4(),
            title = parseListItemPath(item, titlePath, separator),
            subtitle = parseListItemPath(item, subtitlePath, separator),
            headline = parseListItemPath(item, headlinePath, separator),

            phone: string = get(item, 'phone', ''),
            email: string = get(item, 'email', ''),
            summary: string = get(item, 'summary', ''),
            date = formatDateString(get(item, 'date', ''), dateFormat);

          return (
            <div key={id} className="mb-2 grid gap-1">
              <div className="grid gap-1">
                {title && <div className="font-bold" 
                  style={{ color: colorSubtitle, lineHeight: spacingSubtitle, fontSize: `${fontSizeSubtitle}pt` }}>{title}</div>}
                {subtitle && <div style={{lineHeight: spacingSubtitle, fontSize: `${fontSizeSubtitle}pt`, color: colorSubtitle}}>{subtitle}</div>}
                
                <div className="flex flex-col gap-1 text-xs">
                  {date && <div style={{fontSize: `${fontSizeSubtitle}pt`}} className="opacity-50">{date}</div>}
                  {headline && <span className="opacity-75">{headline}</span>}
                </div>
              </div>

              {summary && <div style={{lineHeight: spacingText, fontSize: `${fontSizeText}pt`}}><Markdown>{summary}</Markdown></div> }
              {(phone || email) && (
                <div className="grid gap-1">
                  {phone && (
                    <DataDisplay icon={<b>Phone Number: </b>}>
                      {phone}
                    </DataDisplay>
                  )}

                  {email && (
                    <DataDisplay icon={<b>Email: </b>}>
                      {email}
                    </DataDisplay>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Section;
