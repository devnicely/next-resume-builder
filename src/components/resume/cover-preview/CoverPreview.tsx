import { ButtonBase, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import Image from 'next/image';
import styles from './CoverPreview.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import { Delete, DriveFileRenameOutline, MoreVert, OpenInNew } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { ResumeSchemaType } from '~/schema';


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
                    pathname: '/cover/[slug]/build',
                    query: { slug: cover.slug }
                }}
            >
                <ButtonBase className={styles.preview}>
                    <Image src={cover.image} alt={cover.name} priority width={400} height={0} />
                </ButtonBase>
            </Link>
            <footer className={styles.meta}>
                <div className={styles.meta}>
                    <p>{cover.name}</p>
                </div>
                <ButtonBase className={styles.menu} onClick={() => {alert(3)}}>
                    <MoreVert />
                </ButtonBase>

                <Menu anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>

                    <MenuItem onClick={() => {alert(3)}}>
                        <ListItemIcon>
                            <OpenInNew className="scale-90" />
                        </ListItemIcon>
                        <ListItemText>Open</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() =>{alert(1)}}>
                        <ListItemIcon>
                            <Delete className="scale-90" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => {alert(2)}}>
                        <ListItemIcon>
                            <DriveFileRenameOutline className="scale-90" />
                        </ListItemIcon>
                        <ListItemText>Rename</ListItemText>
                    </MenuItem>
                </Menu>
            </footer>
        </section>
    )
};

export default CoverPreview;