import get from 'lodash/get';
import { useTranslation } from 'next-i18next';
import { ThemeConfig } from '~/schema';

import ColorAvatar from '~/components/shared/ColorAvatar';
import ColorPicker from '~/components/shared/ColorPicker';
import Heading from '~/components/shared/Heading';
import { colorOptions } from '~/config/colors';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setResumeState } from '~/store/resume/resumeSlice';

import styles from './Theme.module.scss';

const Theme = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const text = '#000000';
  const background =  '#ffffff';
  const primary =  '#f44336';
//   const { background, text, primary } = useAppSelector<ThemeConfig>((state) =>
//     get(state.resume.present, 'metadata.theme'),
//   );

  const handleChange = (property: string, color: string) => {
    dispatch(setResumeState({ path: `metadata.theme.${property}`, value: color[0] !== '#' ? `#${color}` : color }));
  };

  return (
    <>
      <Heading path="metadata.theme" name="Theme" />

      <div className={styles.container}>
        <div className={styles.colorOptions}>
          {colorOptions.map((color) => (
            <ColorAvatar key={color} color={color} onClick={(color) => handleChange('primary', color)} />
          ))}
        </div>

        <ColorPicker
          label="Primary"
          color={primary}
          className="col-span-2"
          onChange={(color) => handleChange('primary', color)}
        />
        <ColorPicker
          label="Background"
          color={background}
          onChange={(color) => handleChange('background', color)}
        />
        <ColorPicker
          label="Text"
          color={text}
          onChange={(color) => handleChange('text', color)}
        />
      </div>
    </>
  );
};

export default Theme;
