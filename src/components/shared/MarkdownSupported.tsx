import { Link2 } from 'lucide-react';
import { Trans, useTranslation } from 'next-i18next';

const MarkdownSupported: React.FC = () => {
  const { t } = useTranslation();

  return (
    <span className="inline-block pt-1 opacity-75">
      <Trans t={t} i18nKey="common.markdown.help-text">
        This section supports
        <Link2 href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer">
          markdown
        </Link2>
        formatting.
      </Trans>
    </span>
  );
};

export default MarkdownSupported;
