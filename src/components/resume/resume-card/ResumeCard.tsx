import { Plus } from "lucide-react";
import { Button } from "~/components/common/button";


import { useAppDispatch } from '~/store/hooks';
import { ModalName, setModalState } from '~/store/modal/modalSlice';

import styles from './ResumeCard.module.scss';

type Props = {
  modal: ModalName;
  title: string;
  subtitle: string;
};


const ResumeCard: React.FC<Props> = ({ modal, title, subtitle }) => {
  const dispatch = useAppDispatch();

  const handleClick = () => dispatch(setModalState({ modal, state: { open: true } }));

  return (
    <section className={styles.resume}>
      <Button className={styles.preview} onClick={handleClick}>
        <Plus size="64" color="black"/>
      </Button>

      <footer>
        <div className={styles.meta}>
          <p>{title}</p>
          <p>{subtitle}</p>
        </div>
      </footer>
    </section>
  );
};

export default ResumeCard;
