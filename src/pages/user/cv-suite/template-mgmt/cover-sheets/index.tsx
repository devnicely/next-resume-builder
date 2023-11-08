import React, { useState } from "react";
import { Button } from "~/components/common/button";
import UserLayout from "~/components/layout/UserLayout";
import ResumePreview from "~/components/resume/resume-preview/ResumePreview";
import { Resume } from "~/schema";
import styles from "~/styles/template-mgmt.module.scss";
import localStyle from "./CoverSheets.module.scss";
import { useRouter } from "next/router";
import clsx from "clsx";

const resumes: Resume[] = [
    {
        id: 1,
        shortId: 'qwe',
        name: 'David Zoppina',
        slug: 'david-zoppina',
        image: '/images/templates/covers/1.jpg',
    },
    {
        id: 2,
        shortId: 'andrde',
        name: 'Daniel Deepo',
        slug: 'daniel-deepo',
        image: '/images/templates/covers/2.jpg',
    }
];


const CoverSheets = () => {
    const router = useRouter();
    const goPage = (url: string) => router.push(url);

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
                    {resumes && resumes.map((resume) => (
                        <ResumePreview key={resume.id} resume={resume} />
                    ))}
                </main>
            </div>
        </UserLayout>);
};

export default CoverSheets;


