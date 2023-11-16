import get from 'lodash/get';
import { Metadata, ThemeConfig } from '~/schema';

import { useAppSelector } from '~/store/hooks';

const Heading: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {

  const metadata: Metadata = useAppSelector((state) => get(state.resume.present, 'metadata'));
  const {text: fontSizeText, section: fontSizeSection, subtitle: fontSizeSubtitle} = metadata.typography.size;
  const {section: spacingSection} = metadata.typography.spacing;
  const {section: colorSection} = metadata.typography.color;
  const theme: ThemeConfig = metadata.theme;
  

  return (
    <h3
      className="mb-2 inline-block border-b-2 pb-1 font-bold uppercase opacity-75"
      style={{ borderColor: theme.primary, 
        color: colorSection, display: 'inline-block', lineHeight: spacingSection, fontSize: `${fontSizeSection}pt` }}
    >
      {children}
    </h3>
  );
};

export default Heading;
