import BaseModal from "~/components/shared/BaseModal"
import { useAppDispatch, useAppSelector } from "~/store/hooks"
import { setModalState } from "~/store/modal/modalSlice";
import { api } from "~/utils/api";
import { useRouter } from 'next/router';
import { Button } from "~/components/common/button";
import { useSession } from "next-auth/react";
import { Resume, SessionData } from "~/schema";
import TemplatePreview from "~/components/resume/template-preview/TemplatePreview";
import { TemplateType, defaultResumeState } from "~/constants";
import { isEmpty, isNull } from "lodash";
import { useEffect, useState } from "react";
import { setResume, setResumeState } from "~/store/resume/resumeSlice";
import { Item } from "@radix-ui/react-select";
import { notify, notifyError } from "~/components/ReactHotToast";


const ShowTemplatesModal: React.FC = () => {
    const { data: sessionData } = useSession() as { data: SessionData | null };
    const userId: string = sessionData?.user.userId ?? '';
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { open: isOpen } = useAppSelector((state) => state.modal['show-template-modal']);
    const [resumetpls, setResumetpls] = useState<Resume[]>();
    const [covertpls, setCovertpls] = useState<Resume[]>();
    const resume: Resume = useAppSelector((state) => state.resume.present)
    const {metadata, covermetadata} = resume;

    const {
        data: templates,
        refetch,
        isSuccess,
        isLoading,
    } = api.template.getTemplatesByUserId.useQuery({ userId });

    
    const coverTemplates: Resume[] = (templates ?? []).filter((template) => template.type === TemplateType.COVER_TEMPLATE);
    const resumeTemplates: Resume[] = (templates ?? []).filter((template) => template.type === TemplateType.RESUME_TEMPLATE);
    
    useEffect(() => {
        setCovertpls(coverTemplates);
        setResumetpls(resumeTemplates);
    }, [isSuccess, isOpen]);

    const isCheckedCover = covertpls?.filter((item) => item.checked).length ?? 0;
    const isCheckedResume = resumetpls?.filter((item) => item.checked).length ?? 0;
    

    const handleClickEditResume = () => {
        if (isCheckedCover < 1){
            notifyError({message: "Please check a cover template"});
            return;
        }

        if (isCheckedResume < 1){
            notifyError({message: "Please check a resume template"});
            return;
        }
        
        // dispatch(setResumeState({path: 'metadata.layout', value: [covermetadata.layout[0], metadata.layout[0]]}));
        // dispatch(setResumeState({path: 'metadata.template', value: 'simpleresume'}));
        // dispatch(setModalState({modal: 'create-integrated-resume-modal', state: {open: true}}));
        // handleClose();
    }

    const handleClose = () => {
        dispatch(setModalState({ modal: 'show-template-modal', state: { open: false } }));
    }

    const onCheckedCoverTemplate = (pos: number) => {
        const updatedCoverpls = covertpls?.map((template, index) => {
            if (index === pos) {
                return { ...template, checked: !template.checked };
            }else{
                return { ...template, checked: false };
            }
        });
        setCovertpls(updatedCoverpls);

        if (covertpls && covertpls.length > pos) {
            const coverTemplate = covertpls[pos];
            dispatch(setResumeState({path: 'covermetadata', value: coverTemplate?.metadata}));
            dispatch(setResumeState({path: 'metadata.layout', value: coverTemplate?.metadata}));
            dispatch(setResumeState({path: 'sections.title_recruiter_information.name', value: coverTemplate?.sections.title_recruiter_information?.name}));
            dispatch(setResumeState({path: 'sections.title_candidate_information.name', value: coverTemplate?.sections.title_candidate_information?.name}));
          }

    }

    const onCheckedResumeTemplate = (pos: number) => {
        const updatedResumetpls = resumetpls?.map((template, index) => {
            if (index === pos) {
                return { ...template, checked: !template.checked };
            }else{
                return { ...template, checked: false };
            }
        });
        setResumetpls(updatedResumetpls);

        if (resumetpls && resumetpls.length > pos) {
            const resumeTemplate = resumetpls[pos];
            dispatch(setResumeState({path: 'metadata', value: resumeTemplate?.metadata}));
            dispatch(setResumeState({path: 'sections.recruiter_information.name', value: resumeTemplate?.sections.recruiter_information?.name}));
            dispatch(setResumeState({path: 'sections.recruiter_information.visible', value: resumeTemplate?.sections.recruiter_information?.visible}));
            dispatch(setResumeState({path: 'sections.candidate_summary.name', value: resumeTemplate?.sections.candidate_summary?.name}));
            dispatch(setResumeState({path: 'sections.candidate_summary.visible', value: resumeTemplate?.sections.candidate_summary?.visible}));
            dispatch(setResumeState({path: 'sections.work_experience.name', value: resumeTemplate?.sections.work_experience?.name}));
            dispatch(setResumeState({path: 'sections.work_experience.visible', value: resumeTemplate?.sections.work_experience?.visible}));
            dispatch(setResumeState({path: 'sections.skills.name', value: resumeTemplate?.sections.skills?.name}));
            dispatch(setResumeState({path: 'sections.skills.visible', value: resumeTemplate?.sections.skills?.visible}));
            dispatch(setResumeState({path: 'sections.activities.name', value: resumeTemplate?.sections.activities?.name}));
            dispatch(setResumeState({path: 'sections.activities.visible', value: resumeTemplate?.sections.activities?.visible}));
            dispatch(setResumeState({path: 'sections.education.name', value: resumeTemplate?.sections.education?.name}));
            dispatch(setResumeState({path: 'sections.education.visible', value: resumeTemplate?.sections.education?.visible}));
            dispatch(setResumeState({path: 'sections.references.name', value: resumeTemplate?.sections.references?.name}));
            dispatch(setResumeState({path: 'sections.references.visible', value: resumeTemplate?.sections.references?.visible}));
            dispatch(setResumeState({path: 'sections.certifications.name', value: resumeTemplate?.sections.certifications?.name}));
            dispatch(setResumeState({path: 'sections.certifications.visible', value: resumeTemplate?.sections.certifications?.visible}));
            dispatch(setResumeState({path: 'sections.strengths.name', value: resumeTemplate?.sections.strengths?.name}));
            dispatch(setResumeState({path: 'sections.strengths.visible', value: resumeTemplate?.sections.strengths?.visible}));
            dispatch(setResumeState({path: 'sections.awards.name', value: resumeTemplate?.sections.awards?.name}));
            dispatch(setResumeState({path: 'sections.awards.visible', value: resumeTemplate?.sections.awards?.visible}));
          }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            heading="Templates"
            handleClose={handleClose}
            footerChildren={
                <Button type="submit" disabled={isLoading} onClick={handleClickEditResume}>
                    Create Resume
                </Button>
            }
            className={"lg:max-w-screen-lg max-w-screen-md overflow-y-scroll max-h-screen"}>

            <h1>Cover</h1>
            <div className="flex flex-wrap gap-3">
                {
                    isEmpty(covertpls) ? <h1 className="text-center flex-1">No Cover's Templates</h1> 
                    : covertpls?.map((template, i) => <TemplatePreview key={i} checked={template.checked ?? false} pos={i} handlClick={onCheckedCoverTemplate} resume={template} />)
                }
            </div>

            <h1>Resume</h1>
            <div className="flex flex-wrap gap-3">
                {
                    isEmpty(resumetpls) ? <h1 className="text-center flex-1">No Resume's Templates</h1> 
                    : resumetpls?.map((template, i) => <TemplatePreview key={i} pos={i} checked={template.checked ?? false} handlClick={onCheckedResumeTemplate} resume={template} />)
                }
            </div>
        </BaseModal>
    )
}

export default ShowTemplatesModal;