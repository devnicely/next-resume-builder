import React, { useState } from "react";
import { Button } from "~/components/common/button";
import UserLayout from "~/components/layout/UserLayout";
import ResumePreview from "~/components/resume/resume-preview/ResumePreview";
import { Resume } from "~/schema";
import styles from "~/styles/template-mgmt.module.scss";
import localStyle from "./CoverSheets.module.scss";
import { useRouter } from "next/router";
import clsx from "clsx";
import { TemplateType } from "~/constants";
import CoverPreview from "~/components/resume/cover-preview/CoverPreview";
import ResumeCard from "~/components/resume/resume-card/ResumeCard";
import { api } from "~/utils/api";


const CoverSheets = () => {
    const router = useRouter();
    const goPage = (url: string) => router.push(url);

    const {
        data: covers,
        refetch
    } = api.template.getResumes.useQuery({type: TemplateType.COVER_TEMPLATE});


    return (
        <UserLayout title="Template Management">
            <div className={styles.container}>
                <header>
                    <Button
                        onClick={() => goPage('/user/cv-suite/template-mgmt/resumes')}
                        type="button"
                        className={clsx(localStyle.btn, localStyle.resume)}
                    >
                        Resume
                    </Button>

                    <Button
                        onClick={() => goPage('/user/cv-suite/template-mgmt/cover-sheets')}
                        type="button"
                        className={clsx(localStyle.btn, localStyle.cover)}
                    >
                        Cover Sheet
                    </Button>
                </header>

                <main className={styles.resumes}>
                    <ResumeCard
                        modal="create-coversheet"
                        title=""
                        subtitle=""
                    />
                </main>
                <div>Saved CoverSheet</div><hr/>

                <main className={styles.resumes}>
                    {covers && covers.map((cover) => (
                        <CoverPreview key={cover.id} cover={cover} />
                    ))}
                </main>
            </div>
        </UserLayout>);
};

export default CoverSheets;


