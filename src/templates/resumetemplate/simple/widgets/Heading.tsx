import get from 'lodash/get';
import { ReactNode } from 'react';
import { Metadata, Section, SectionType, ThemeConfig } from '~/schema';

import { useAppSelector } from '~/store/hooks';
import { cn } from '~/utils/styles';

type Props = {
  children: ReactNode;
  path: string;
}

const Heading: React.FC<Props> = ({ children, path }) => {

  const section: Section = useAppSelector((state) => get(state.resume.present, path, {} as Section));
  
  const metadata: Metadata = useAppSelector((state) => get(state.resume.present, 'metadata'));
  const {text: fontSizeText, section: fontSizeSection, subtitle: fontSizeSubtitle} = metadata.typography.size;
  const {section: spacingSection} = metadata.typography.spacing;
  const {section: colorSection} = metadata.typography.color;
  const theme: ThemeConfig = metadata.theme;
  
  return (
    <h3
      className={cn('mb-2 inline-block border-b-2 pb-1 font-bold opacity-75', {uppercase: section.isUppercase})}
      style={{ borderColor: theme.primary, 
        color: colorSection, display: 'inline-block', lineHeight: spacingSection, fontSize: `${fontSizeSection}pt` }}
    >
      {children}
    </h3>
  );
};

export default Heading;
