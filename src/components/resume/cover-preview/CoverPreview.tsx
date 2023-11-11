import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/common/dropdown-menu';

import { MoreVertical, ExternalLink, Trash2, PencilLine } from 'lucide-react';

import Image from 'next/image';
import styles from './CoverPreview.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ResumeSchemaType } from '~/schema';
import { Button } from '~/components/common/button';


type Props = {
    cover: ResumeSchemaType;
};
const CoverPreview: React.FC<Props> = ({ cover }) => {
    const router = useRouter();

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleOpenMenu = (event: React.MouseEvent<Element>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <section className={styles.resume}>
            <Link
                passHref
                href={{
                    pathname: '/resume/[slug]/build',
                    query: { slug: cover.slug }
                }}
            >
                {/* <Button className={styles.preview}> */}
                    <Image src={cover.image} alt={cover.name} priority width={400} height={0} />
                {/* </Button> */}
            </Link>

            <footer className={styles.meta}>
                <div className={styles.meta}>
                    <p>{cover.name}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button className={styles.menu} variant="ghost" size="icon">
                            <MoreVertical size="28" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {alert(3)}}>
                        <ExternalLink size="16" /> &nbsp; Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {alert(1)}}>
                            <Trash2 size="16" /> &nbsp; Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {alert(2)}}>
                        <PencilLine size="16" /> &nbsp; Rename
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </footer>
        </section>
    )
};

export default CoverPreview;