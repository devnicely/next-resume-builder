import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/common/dropdown-menu';

import Image from 'next/image';
import styles from './ResumeCard.module.scss';
import Link from 'next/link';
import { ResumeSchemaType } from '~/schema';
import { useState } from 'react';
import { MoreVertical, ExternalLink, Trash2, PencilLine } from 'lucide-react';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import useRefetch from '~/hooks/useRefetch';
import { notify, notifyError } from '~/components/ReactHotToast';
import { useAppDispatch } from '~/store/hooks';
import { setModalState } from '~/store/modal/modalSlice';
import { Button } from '~/components/common/button';
import { TemplateType } from '~/constants';
import useRefetchResumes from '~/hooks/useRefetchResumes';


type Props = {
    resume: ResumeSchemaType;
};
const ResumePreview: React.FC<Props> = ({ resume }) => {
    const router = useRouter();
    const { refetchGetResumes } = useRefetchResumes(TemplateType.RESUME_TEMPLATE);
    const dispatch = useAppDispatch();

    const {
        mutateAsync: deleteResume,   
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
                            await deleteResume({ id: resume.id }).then(() => {
                                void refetchGetResumes();
                                notify({ message: "Deleted Resume Template Successfully." });
                            }).catch(() => {
                                notifyError({ message: "Failed to delete the resume." });
                            });
                            handleClose();
                        },
                    },
                },
            }),
        );
    };

    const handleRename = () => {
        dispatch(
            setModalState({
                modal: 'rename-resume-template',
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
        router.push({
            pathname: '/resume/[id]/build',
            query: { id: resume.id }
        });
    };

    return (
        <section className={styles.resume}>
            <Link
                passHref
                href={{
                    pathname: '/resume/[id]/build',
                    query: { id: resume.id }
                }}
            >
                {/* <Button className={styles.preview}> */}
                <Image src={resume.image} alt={resume.name} priority width={400} height={0} />
                {/* </Button> */}
            </Link>
            <footer className={styles.meta}>
                <div className={styles.meta}>
                    <p>{resume.name}</p>
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

export default ResumePreview;