import React, { useState } from "react";
import { Button } from "~/components/common/button";
import UserLayout from "~/components/layout/UserLayout";
import ResumePreview from "~/components/resume/resume-preview/ResumePreview";
import { Resume } from "~/schema";
import styles from "~/styles/template-mgmt.module.scss";
import localStyle from "./CoverSheets.module.scss";
import { useRouter } from "next/router";
import clsx from "clsx";
import { defaultCoverState } from "~/constants";
import { Cover } from "~/schema/cover";
import CoverPreview from "~/components/resume/cover-preview/CoverPreview";

const cover: Cover = defaultCoverState;
const covers: Cover[] = [
    cover
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
                    {covers && covers.map((cover) => (
                        <CoverPreview key={cover.id} cover={cover} />
                    ))}
                </main>
            </div>
        </UserLayout>);
};

export default CoverSheets;


