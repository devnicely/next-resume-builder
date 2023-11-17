import { joiResolver } from '@hookform/resolvers/joi';
import { PencilLine } from 'lucide-react';
import { Resume } from '~/schema';
import Joi from 'joi';
import get from 'lodash/get';
import noop from 'lodash/noop';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import BaseModal from '~/components/shared/BaseModal';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { ModalState, setModalState } from '~/store/modal/modalSlice';
import useRefetch from '~/hooks/useRefetch';
import { api } from '~/utils/api';
import { Input } from '~/components/common/input';
import { Label } from '~/components/common/label';
import { Button } from '~/components/common/button';
import { TemplateType } from '~/constants';
import useRefetchResumes from '~/hooks/useRefetchResumes';

type FormData = {
    name: string;
    slug: string;
};

const schema = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string()
        .lowercase()
        .min(3)
        .regex(/^[a-z0-9-]+$/, 'only lowercase characters, numbers and hyphens')
        .required(),
});

const RenameResumeModal: React.FC = () => {

    const dispatch = useAppDispatch();
    const { refetchGetResumes } = useRefetchResumes(TemplateType.RESUME_TEMPLATE);

    const {
        mutateAsync: renameResumeTemplate,
        isLoading,
    } = api.template.renameResumeTemplate.useMutation();

    const { open: isOpen, payload } = useAppSelector((state) => state.modal['rename-resume-template']) as ModalState;
    const resume: Resume = get(payload, 'item') as Resume;
    const onComplete = get(payload, 'onComplete', noop);


    const { reset, watch, control, setValue, handleSubmit } = useForm<FormData>({
        defaultValues: {
            name: resume?.name,
            slug: resume?.slug,
        },
        resolver: joiResolver(schema),
    });
    const name = watch('name');

    useEffect(() => {
        const slug = name
            ? name
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/[ ]/gi, '-')
            : '';

        setValue('slug', slug);
    }, [name, setValue]);

    useEffect(() => {
        if (!resume) return;

        const { name, slug }: FormData = resume;

        reset({ name, slug });
    }, [resume, reset]);



    const onSubmit = async ({ name, slug }: FormData) => {
        if (!resume) return;

        const newResume = await renameResumeTemplate({ id: resume.id, name, slug });

        onComplete && onComplete(newResume);

        void refetchGetResumes();

        handleClose();
    };

    const handleClose = () => {
        dispatch(setModalState({ modal: 'rename-resume-template', state: { open: false } }));
        reset();
    };

    return (
        <BaseModal
            icon={<PencilLine />}
            isOpen={isOpen}
            heading="Rename"
            handleClose={handleClose}
            footerChildren={
                <Button type="submit" disabled={isLoading} onClick={handleSubmit(onSubmit)}>
                    Rname Templage
                </Button>
            }
        >
            <form className="grid gap-4">
            <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Label>Name</Label>
                            <Input
                                autoFocus
                                {...field}
                            />
                        </>
                    )}
                />

                <Controller
                    name="slug"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Label>Slug</Label>
                        <Input
                            {...field}
                        />
                        </>
                    )}
                />
            </form>
        </BaseModal>
    );
};

export default RenameResumeModal;
