import React, { useEffect } from "react";
import { Button } from "~/components/common/button";
import UserLayout from "~/components/layout/UserLayout";
import ResumePreview from "~/components/resume/resume-preview/ResumePreview";
import styles from "~/styles/template-mgmt.module.scss";
import localStyles from "./Resumes.module.scss";
import { useRouter } from "next/router";
import clsx from 'clsx';
import { NextPage } from "next";
import ResumeCard from "~/components/resume/resume-card/ResumeCard";
import { Plus } from "lucide-react";
import { api } from "~/utils/api";
import { ActionCreators } from "redux-undo";
import { useAppDispatch } from "~/store/hooks";
import { TemplateType } from "~/constants";


const Resumes: NextPage = () => {
    const router = useRouter();
    const goPage = (url: string) => router.push(url);
    const dispatch = useAppDispatch();
    
    const {
        data: resumes,
        refetch
    } = api.template.getResumes.useQuery({type: TemplateType.RESUME_TEMPLATE});

    useEffect(() => {
        dispatch(ActionCreators.clearHistory());
      }, []);
    
      if (!resumes) return null;
    
    return (
        <UserLayout title="Template Management">
            <div className={styles.container}>
                <header>
                    <Button
                        onClick={() => goPage('/user/cv-suite/template-mgmt/resumes')}
                        type="button"
                        className={clsx(localStyles.btn, localStyles.resume)}
                    >
                        Resume
                    </Button>

                    <Button
                        onClick={() => goPage('/user/cv-suite/template-mgmt/cover-sheets')}
                        type="button"
                        className={clsx(localStyles.btn, localStyles.cover)}
                    >
                        Cover Sheet
                    </Button>
                </header>

                <main className={styles.resumes}>
                    <ResumeCard
                        modal="create-resume"
                        title=""
                        subtitle=""
                    />
                </main>
                <div>Saved Resumes</div><hr/>
                <main className={styles.resumes}>
                    {resumes && resumes.map((resume) => (
                        <ResumePreview key={resume.id} resume={resume} />
                    ))}
                </main>

            </div>
        </UserLayout>
    );
};

export default Resumes;