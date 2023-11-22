import { Plus } from "lucide-react";
import { Button } from "~/components/common/button";
import Image from 'next/image';
import { useAppDispatch } from '~/store/hooks';
import { ModalName, setModalState } from '~/store/modal/modalSlice';

import styles from './ResumeCard.module.scss';

type Props = {
  modal: ModalName;
  template_name: string;
  template_preview: string;
  template_id: string;
};


const ResumeCard: React.FC<Props> = ({ modal, template_name, template_preview, template_id }) => {
  const dispatch = useAppDispatch();

  const handleClick = () => dispatch(setModalState({ modal, state: { open: true, template_id: template_id } }));

  return (
    <section className={styles.resume}>
      <div className={styles.preview} onClick={handleClick}>
        <Image src={template_preview} alt={template_name} priority width={400} height={0} />
      </div>

      <footer>
        <div className={styles.meta}>
          <p>{template_name}</p>
          {/* <p>{template_preview}</p> */}
        </div>
      </footer>
    </section>
  );
};

export default ResumeCard;
