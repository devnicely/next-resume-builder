import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
} from 'lucide-react';


  import get from 'lodash/get';
  import { useRouter } from 'next/router';
  import { useTranslation } from 'next-i18next';
  import { useEffect, useMemo, useState } from 'react';
  import toast from 'react-hot-toast';
  import { useMutation } from 'react-query';
  import { Resume } from '~/schema';
  
  import { RESUMES_QUERY } from '~/constants/index';
  import { ServerError } from '~/services/axios';
  import queryClient from '~/services/react-query';
  import { deleteResume, DeleteResumeParams, duplicateResume, DuplicateResumeParams } from '~/services/resume';
  import { setSidebarState, toggleSidebar } from '~/store/build/buildSlice';
  import { useAppDispatch, useAppSelector } from '~/store/hooks';
  import { setModalState } from '~/store/modal/modalSlice';
  import getResumeUrl from '~/utils/getResumeUrl';
  import { cn } from '~/utils/styles';
  
  import styles from './Header.module.scss';
  
  const Header = () => {
  
    const router = useRouter();
  
    const { t } = useTranslation();
  
    const dispatch = useAppDispatch();
  

    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 1280); // Set breakpoint value according to your needs
      };
  
      handleResize(); // Initial check
  
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);


  
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  
    const resume = useAppSelector((state) => state.resume.present);
    const { left, right } = useAppSelector((state) => state.build.sidebar);
  
    const { mutateAsync: deleteMutation } = useMutation<void, ServerError, DeleteResumeParams>(deleteResume);
    const { mutateAsync: duplicateMutation } = useMutation<Resume, ServerError, DuplicateResumeParams>(duplicateResume);
  
    const name = useMemo(() => get(resume, 'name'), [resume]);
  
    useEffect(() => {
      if (isDesktop) {
        dispatch(setSidebarState({ sidebar: 'left', state: { open: true } }));
        dispatch(setSidebarState({ sidebar: 'right', state: { open: true } }));
      } else {
        dispatch(setSidebarState({ sidebar: 'left', state: { open: false } }));
        dispatch(setSidebarState({ sidebar: 'right', state: { open: false } }));
      }
    }, [isDesktop, dispatch]);
  
    const toggleLeftSidebar = () => dispatch(toggleSidebar({ sidebar: 'left' }));
  
    const toggleRightSidebar = () => dispatch(toggleSidebar({ sidebar: 'right' }));
  
    const goBack = () => router.push('/dashboard');
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleRename = () => {
      handleClose();
  
      dispatch(
        setModalState({
          modal: 'dashboard.rename-resume',
          state: {
            open: true,
            payload: {
              item: resume,
              onComplete: (newResume: Resume) => {
                queryClient.invalidateQueries(RESUMES_QUERY);
  
                router.push(`/${resume.user.username}/${newResume.slug}/build`);
              },
            },
          },
        }),
      );
    };
  
    const handleDuplicate = async () => {
      handleClose();
  
      const newResume = await duplicateMutation({ id: resume.id });
  
      queryClient.invalidateQueries(RESUMES_QUERY);
  
      router.push(`/${resume.user.username}/${newResume.slug}/build`);
    };
  
    const handleDelete = async () => {
      handleClose();
  
      await deleteMutation({ id: resume.id });
  
      queryClient.invalidateQueries(RESUMES_QUERY);
  
      goBack();
    };
  
    const handleShareLink = async () => {
      handleClose();
  
      const url = getResumeUrl(resume, { withHost: true });
      await navigator.clipboard.writeText(url);
  
      toast.success("A link to your resume has been copied to your clipboard.");
    };
  
    return (
      <div className="bg-white shadow-sm absolute top-0 left-0 right-0 z-10">
      <div
        className={`${styles.header} ${left.open ? styles.pushLeft : ''} ${right.open ? styles.pushRight : ''}`}
      >
        <button onClick={toggleLeftSidebar} className="p-2">
          {left.open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>
  
        <div className={styles.title}>
          <button className="p-2 opacity-50 hover:opacity-100" onClick={goBack}>
            <HomeIcon/>
          </button>
  
          <span className="opacity-50">{'/'}</span>
  
          <h1>{name}</h1>
        </div>
  
        <button onClick={toggleRightSidebar} className="p-2">
          {right.open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>
    </div>
    );
  };
  
  export default Header;
  