import clsx from 'clsx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { useAppDispatch } from '~/store/hooks';
import { setResume } from '~/store/resume/resumeSlice';
import styles from '~/styles/pages/Printer.module.scss';
import Page from '~/components/resume/build/Center/Page';
import { api } from '~/utils/api';
import { Resume } from '~/schema';
import { TemplateType } from '~/constants';

type QueryParams = {
  slug: string;
};

type Props = {
  slug: string;
};


export const getServerSideProps: GetServerSideProps<Props | Promise<Props>, QueryParams> = async ({
  query,
}) => {
  const { slug } = query as QueryParams;

  return {
    props: {slug}
  }
};

const Printer: NextPage<Props> = ({ slug }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const id: number = parseInt(slug);
    const {
        data: resume,
        isLoading,
        refetch,
        isSuccess
    } = api.template.getResumeById.useQuery({id});
    

  if (!resume || isEmpty(resume)) return null;
    dispatch(setResume(resume));

  const layout: string[][][] = get(resume, 'metadata.layout', []);

  return (
    <div className={clsx('printer-mode', styles.container)}>
      {layout.map((_, pageIndex) => (
        <Page key={pageIndex} page={pageIndex} />
      ))}
    </div>
  );
};

export default Printer;
