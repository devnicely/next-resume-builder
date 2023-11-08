import { ButtonBase} from '@mui/material';
import Image from 'next/image';
import styles from './ResumeCard.module.scss';
import { Resume } from '~/schema';
import Link from 'next/link';
import { ResumeSchemaType } from '~/validation/resume';

type Props = {
    resume: ResumeSchemaType;
};
const ResumePreview: React.FC<Props> = ({ resume }) => {
    return (
        <section className={styles.resume}>
            <Link
                passHref
                href={{
                    pathname: '/resume/[slug]/build',
                    query: { slug: resume.slug }
                }}
            >
                <ButtonBase className={styles.preview}>
                    <Image src={resume.image} alt={resume.name} priority width={400} height={0} />
                </ButtonBase>
            </Link>
            <footer className={styles.meta}>
                <div className={styles.meta}>
                    <p>{resume.name}</p>
                </div>
            </footer>
        </section>
    )
};

export default ResumePreview;