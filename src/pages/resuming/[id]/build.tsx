import { isEmpty } from "lodash";
import { GetServerSideProps, NextPage } from "next";
import ScreenLoading from "~/components/common/ScreenLoading";
import UserLayout from "~/components/layout/UserLayout";
import Center from "~/components/resume/build/Center/Center";
import LeftSidebar from "~/components/resume/build/LeftSidebar/LeftSidebar";
import RightSidebar from "~/components/resume/build/RightSidebar/RightSidebar";
import { useAppDispatch } from "~/store/hooks";
import { setResume } from "~/store/resume/resumeSlice";
import { api } from "~/utils/api";

type QueryParams = {
    id: string
}

type Props = {
    id: string
}

export const getServerSideProps: GetServerSideProps<Props> = async ({query}) => {
    const {id} = query as QueryParams;    
    return {
        props: { id }
    }
}

const Build: NextPage<Props> = ({ id }) => {
    const dispatch = useAppDispatch();

    const {
        data: resume,
        isLoading,
        refetch
    } = api.template.getResumeById.useQuery({id});

    if (!resume || isEmpty(resume)) return null;
        dispatch(setResume(resume));
    
    return (
        isLoading? <ScreenLoading/> :
        <UserLayout>
            <div style={{ position: 'relative' }}>
                <LeftSidebar />
                <Center />
                <RightSidebar />
            </div>
        </UserLayout>
    )
}

export default Build;

