import { Plus as Add } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import BaseModal from "~/components/shared/BaseModal"
import { useAppDispatch, useAppSelector } from "~/store/hooks"
import { setModalState } from "~/store/modal/modalSlice";
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { TemplateType } from "~/constants";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { useRouter } from 'next/router';
import { Button } from "~/components/common/button";
import { Input } from "~/components/common/input";
import { Label } from "~/components/common/label";
import useFetchTemplates from "~/hooks/useFetchTemplates";
import ScreenLoading from "~/components/common/ScreenLoading";

type FormData = {
    name: string;
    slug: string;
    isPublic: boolean;
};

const defaultState: FormData = {
    name: '',
    slug: '',
    isPublic: true,
};

const schema = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string()
        .lowercase()
        .min(3)
        .regex(/^[a-z0-9-]+$/, 'only lowercase characters, numbers and hyphens')
        .required(),
    isPublic: Joi.boolean().default(true).required(),
});

const CreateResumeTemplate: React.FC = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { open: isOpen } = useAppSelector((state) => state.modal['create-resume-template']);
    const { template_id } = useAppSelector((state) => state.modal["create-resume-template"]);
    const { refetchGetTemplates } = useFetchTemplates();

    const {
        mutateAsync: createResume,
        isLoading: isCreatingResume,
        isSuccess,
    } = api.template.createResume.useMutation();

    const { reset, watch, control, setValue, handleSubmit } = useForm<FormData>({
        defaultValues: defaultState,
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

    const onSubmit = async ({ name, slug, isPublic }: FormData) => {
        if (template_id) {
            await createResume({ name, slug, isPublic, type: TemplateType.RESUME_TEMPLATE, template_id })
                .then((data) => {
                    handleClose();
                    refetchGetTemplates();
                    router.push({
                        pathname: '/resume/[id]/build',
                        query: { id: data.resume_id }
                    });
                }).catch(() => {

                })
        }
    };

    const handleClose = () => {
        dispatch(setModalState({ modal: 'create-resume-template', state: { open: false } }));
        reset();
    }


    return (
        isCreatingResume ? <ScreenLoading/>
            :
            <BaseModal
                isOpen={isOpen}
                icon={<Add />}
                heading="Create a resume template"
                handleClose={handleClose}
                footerChildren={
                    <Button type="submit" disabled={isCreatingResume} onClick={handleSubmit(onSubmit)}>
                        Create Resume
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
                </form>
            </BaseModal>
    )
}

export default CreateResumeTemplate;