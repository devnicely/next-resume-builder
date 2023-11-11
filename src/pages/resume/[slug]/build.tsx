import { NextPage, GetServerSideProps } from "next";
import UserLayout from "~/components/layout/UserLayout";
import LeftSidebar from "~/components/resume/build/LeftSidebar/LeftSidebar";
import RightSidebar from '~/components/resume/build/RightSidebar/RightSidebar';
import Center from "~/components/resume/build/Center/Center";
import { useAppDispatch } from "~/store/hooks";
import { setResume } from "~/store/resume/resumeSlice";
import isEmpty from 'lodash/isEmpty';
import { api } from "~/utils/api";
import { Resume } from "~/schema";
import { TemplateType } from "~/constants";

type QueryParams = {
    slug: string
}

type Props = {
    slug: string,
};


export const getServerSideProps: GetServerSideProps<Props> = async ({query}) => {
    const {slug} = query as QueryParams;    
    return {
        props: {slug}
    }
};

const Build: NextPage<Props> = ({slug}) => {
    const dispatch = useAppDispatch();

    const {
        data: resume,
        isLoading,
        refetch
    } = api.resume.getResumeBySlug.useQuery({slug: slug});

    if (!resume || isEmpty(resume)) return null;
    
    dispatch(setResume(resume));

    return(
        <UserLayout>
            <div style={{position: 'relative'}}>
                <LeftSidebar/>
                <Center/>
                <RightSidebar />
            </div>
        </UserLayout>
    )
};

export default Build;