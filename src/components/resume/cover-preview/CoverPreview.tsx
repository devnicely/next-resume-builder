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
import { useAppDispatch } from '~/store/hooks';
import { setModalState } from '~/store/modal/modalSlice';
import useRefetchResumes from '~/hooks/useRefetchResumes';
import { TemplateType } from '~/constants';
import { api } from '~/utils/api';
import { notify, notifyError } from '~/components/ReactHotToast';


type Props = {
    cover: ResumeSchemaType;
};
const CoverPreview: React.FC<Props> = ({ cover }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { refetchGetResumes } = useRefetchResumes(TemplateType.COVER_TEMPLATE);

    const handleRename = () => {
        dispatch(
            setModalState({
                modal: 'rename-resume-template',
                state: {
                    open: true,
                    payload: {
                        item: cover,
                        onComplete: () => {
                            void refetchGetResumes();
                        },
                    },
                },
            }),
        );
    };


    const handleOpen = () => {
        router.push({
            pathname: '/cover/[id]/build',
            query: { id: cover.id }
        });
    };

    const {
        mutateAsync: deleteCover,
    } = api.template.deleteResume.useMutation();



    const handleClose = () => {
        dispatch(setModalState({
            modal: 'delete-confirm-modal',
            state: {open: false}
        }));
    }

    const handleDelete = async () => {
        dispatch(
            setModalState({
                modal: 'delete-confirm-modal',
                state: {
                    open: true,
                    payload: {
                        onComplete: async () => {
                            await deleteCover({ id: cover.id }).then(() => {
                                void refetchGetResumes();
                                notify({ message: "Deleted Cover Template Successfully." });
                            }).catch(() => {
                                notifyError({ message: "Failed to delete the resume." });
                            })
                            handleClose();
                        },
                    },
                },
            }),
        );
    };

    return (
        <section className={styles.resume}>
            <Link
                passHref
                href={{
                    pathname: '/cover/[id]/build',
                    query: { id: cover.id }
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
                        <div className={styles.menu}>
                            <MoreVertical size="28" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleOpen()}>
                            <ExternalLink size="16" /> &nbsp; Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete()}>
                            <Trash2 size="16" /> &nbsp; Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRename()}>
                            <PencilLine size="16" /> &nbsp; Rename
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </footer>
        </section>
    )
};

export default CoverPreview;