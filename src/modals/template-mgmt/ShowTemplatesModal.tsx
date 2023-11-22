import BaseModal from "~/components/shared/BaseModal"
import { useAppDispatch, useAppSelector } from "~/store/hooks"
import { setModalState } from "~/store/modal/modalSlice";
import { api } from "~/utils/api";
import { Button } from "~/components/common/button";
import { useSession } from "next-auth/react";
import { Resume, SessionData } from "~/schema";
import TemplatePreview from "~/components/resume/template-preview/TemplatePreview";
import { TemplateType } from "~/constants";
import { cloneDeep, isEmpty, set } from "lodash";
import { useEffect, useState } from "react";
import { setResume, setResumeState } from "~/store/resume/resumeSlice";
import { notifyError } from "~/components/ReactHotToast";



const ShowTemplatesModal: React.FC = () => {

    const dispatch = useAppDispatch();
    const { open: isOpen } = useAppSelector((state) => state.modal['show-template-modal']);
    const [resumetpls, setResumetpls] = useState<Resume[]>();
    const [covertpls, setCovertpls] = useState<Resume[]>();
    const resume: Resume = useAppSelector((state) => state.resume.present)
    const { metadata, covermetadata } = resume;

    const {
        data: templates,
        refetch,
        isSuccess,
        isLoading,
    } = api.template.getTemplates.useQuery();

    const coverTemplates: Resume[] = (templates ?? []).filter((template) => template.type === TemplateType.COVER_TEMPLATE);
    const resumeTemplates: Resume[] = (templates ?? []).filter((template) => template.type === TemplateType.RESUME_TEMPLATE);

    useEffect(() => {
        setCovertpls(coverTemplates);
        setResumetpls(resumeTemplates);
    }, [isSuccess, isOpen]);

    const isCheckedCover = covertpls?.filter((item) => item.checked).length ?? 0;
    const isCheckedResume = resumetpls?.filter((item) => item.checked).length ?? 0;


    const handleClickEditResume = () => {
        if (isCheckedResume < 1) {
            notifyError({ message: "Please check a resume template" });
            return;
        }

        if (isCheckedCover < 1) {
            dispatch(setResumeState({ path: 'metadata.hasCover', value: 0 }));
            dispatch(setResumeState({ path: 'metadata.layout', value: [metadata.layout[0]] }));
            dispatch(setResumeState({ path: 'metadata.template', value: `${covermetadata.template}_${metadata.template}` }));
        }else{
            dispatch(setResumeState({ path: 'metadata.layout', value: [covermetadata.layout[0], metadata.layout[0]] }));
            dispatch(setResumeState({ path: 'metadata.template', value: `${covermetadata.template}_${metadata.template}` }));
        }
        
        dispatch(setModalState({ modal: 'create-integrated-resume-modal', state: { open: true } }));
        handleClose();
    }

    const handleClose = () => {
        dispatch(setModalState({ modal: 'show-template-modal', state: { open: false } }));
    }

    const onCheckedCoverTemplate = (pos: number) => {
        const updatedCoverpls = covertpls?.map((template, index) => {
            if (index === pos) {
                return { ...template, checked: !template.checked };
            } else {
                return { ...template, checked: false };
            }
        });
        setCovertpls(updatedCoverpls);

        if (covertpls && covertpls.length > pos) {
            const coverTemplate = covertpls[pos];
            dispatch(setResumeState({ path: 'covermetadata', value: coverTemplate?.metadata }));
            dispatch(setResumeState({ path: 'metadata.layout', value: coverTemplate?.metadata.layout }));
            dispatch(setResumeState({ path: 'sections.title_recruiter_information.name', value: coverTemplate?.sections.title_recruiter_information?.name }));
            dispatch(setResumeState({ path: 'sections.title_candidate_information.name', value: coverTemplate?.sections.title_candidate_information?.name }));
        }

    }

    const onCheckedResumeTemplate = (pos: number) => {
        const updatedResumetpls = resumetpls?.map((template, index) => {
            if (index === pos) {
                return { ...template, checked: !template.checked };
            } else {
                return { ...template, checked: false };
            }
        });
        setResumetpls(updatedResumetpls);

        if (resumetpls && resumetpls.length > pos) {
            const resumeTemplate = resumetpls[pos];

            const currentTemplate: Resume = cloneDeep(resume);
            set(currentTemplate, 'metadata', resumeTemplate?.metadata);
            set(currentTemplate.sections, 'recruiter_information.name', resumeTemplate?.sections.recruiter_information?.name);
            set(currentTemplate.sections, 'recruiter_information.visible', resumeTemplate?.sections.recruiter_information?.visible);
            
            set(currentTemplate.sections, 'candidate_summary.name', resumeTemplate?.sections.candidate_summary?.name);
            set(currentTemplate.sections, 'candidate_summary.visible', resumeTemplate?.sections.candidate_summary?.name);
            set(currentTemplate.sections, 'work_experience.name', resumeTemplate?.sections.work_experience?.name);
            set(currentTemplate.sections, 'work_experience.visible', resumeTemplate?.sections.work_experience?.name);

            set(currentTemplate.sections, 'skills.name', resumeTemplate?.sections.skills?.name);
            set(currentTemplate.sections, 'skills.visible', resumeTemplate?.sections.skills?.name);
            
            set(currentTemplate.sections, 'activities.name', resumeTemplate?.sections.activities?.name);
            set(currentTemplate.sections, 'activities.visible', resumeTemplate?.sections.activities?.name);

            set(currentTemplate.sections, 'education.name', resumeTemplate?.sections.education?.name);
            set(currentTemplate.sections, 'education.visible', resumeTemplate?.sections.education?.name);
            
            set(currentTemplate.sections, 'references.name', resumeTemplate?.sections.references?.name);
            set(currentTemplate.sections, 'references.visible', resumeTemplate?.sections.references?.name);

            set(currentTemplate.sections, 'certifications.name', resumeTemplate?.sections.certifications?.name);
            set(currentTemplate.sections, 'certifications.visible', resumeTemplate?.sections.certifications?.name);

            set(currentTemplate.sections, 'strengths.name', resumeTemplate?.sections.strengths?.name);
            set(currentTemplate.sections, 'strengths.visible', resumeTemplate?.sections.strengths?.name);

            set(currentTemplate.sections, 'awards.name', resumeTemplate?.sections.awards?.name);
            set(currentTemplate.sections, 'awards.visible', resumeTemplate?.sections.awards?.name);  
            dispatch(setResume(currentTemplate));
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            heading="Templates"
            handleClose={handleClose}
            footerChildren={
                <Button type="submit" disabled={isLoading} onClick={() => handleClickEditResume()}>
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