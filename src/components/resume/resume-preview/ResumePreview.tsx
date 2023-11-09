import { ButtonBase, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import Image from 'next/image';
import styles from './ResumeCard.module.scss';
import Link from 'next/link';
import { ResumeSchemaType } from '~/schema';
import { useState } from 'react';
import { Delete, DriveFileRenameOutline, MoreVert, OpenInNew } from '@mui/icons-material';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import useRefetch from '~/hooks/useRefetch';
import { notify, notifyError } from '~/components/ReactHotToast';
import { useAppDispatch } from '~/store/hooks';
import { setModalState } from '~/store/modal/modalSlice';


type Props = {
    resume: ResumeSchemaType;
};
const ResumePreview: React.FC<Props> = ({ resume }) => {
    const router = useRouter();
    const { refetchGetResumes } = useRefetch();
    const dispatch = useAppDispatch();

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleOpenMenu = (event: React.MouseEvent<Element>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const {
        mutateAsync: deleteResume,
    } = api.resume.deleteResume.useMutation();


    const handleDelete = async () => {
        await deleteResume({ id: resume.id }).then(() => {
            void refetchGetResumes();
            notify({ message: "Deleted Resume Successfully." });
        }).catch(() => {
            notifyError({ message: "Failed to delete the resume." });
        })
        handleClose();
    };

    const handleRename = () => {
        handleClose();

        dispatch(
            setModalState({
              modal: 'rename-resume',
              state: {
                open: true,
                payload: {
                  item: resume,
                  onComplete: () => {
                    void refetchGetResumes();
                  },
                },
              },
            }),
          );
    };

    const handleOpen = () => {
        handleClose();
        router.push({
            pathname: '/resume/[slug]/build',
            query: { slug: resume.slug }
        });
    };

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
                <ButtonBase className={styles.menu} onClick={handleOpenMenu}>
                    <MoreVert />
                </ButtonBase>

                <Menu anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>

                    <MenuItem onClick={handleOpen}>
                        <ListItemIcon>
                            <OpenInNew className="scale-90" />
                        </ListItemIcon>
                        <ListItemText>Open</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleDelete}>
                        <ListItemIcon>
                            <Delete className="scale-90" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleRename}>
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

export default ResumePreview;