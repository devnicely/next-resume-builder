import Image from 'next/image';
import styles from './TemplatePreview.module.scss';
import { Resume } from '~/schema';
import { useRouter } from 'next/router';
import { useAppDispatch } from '~/store/hooks';
import { Checkbox } from '~/components/common/checkbox';

type Props = {
    resume: Resume;
    checked: boolean;
    handlClick: (pos: number) => void;
    pos: number;
};

const TemplatePreview: React.FC<Props> = ({ resume, checked, handlClick, pos }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <section className={styles.resume}>
            <Image src={resume.image} alt={resume.name} priority width={400} height={0} />
            <footer className={styles.meta}>
                <div className={styles.meta}>
                    <p>{resume.name}</p>
                </div>
                <Checkbox checked={checked} onCheckedChange={() => handlClick(pos)}/>
            </footer>
        </section>
    )
};

export default TemplatePreview;