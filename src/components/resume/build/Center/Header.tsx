import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  ChevronDown as KeyboardArrowDownIcon,
  Save,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/common/dropdown-menu';


import { Button } from '~/components/common/button';

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
import { setSidebarState, toggleSidebar } from '~/store/build/buildSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setModalState } from '~/store/modal/modalSlice';
import getResumeUrl from '~/utils/getResumeUrl';
import { cn } from '~/utils/styles';

import styles from './Header.module.scss';

import { api } from '~/utils/api';


const Header = () => {

  const router = useRouter();
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

  const goBack = () => router.push('/user/cv-suite/template-mgmt/resumes');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const {
    mutateAsync: updateResum,
    isLoading,
    isSuccess,
  } = api.resume.updateResum.useMutation();

  const onClickedBtnResumeSave = () => {
    try {
      updateResum({
        id: resume.id,
        shortId: resume.shortId,
        name: resume.name,
        userId: resume.userid,
        slug: resume.slug,
        image: resume.image,
        basics: JSON.stringify(resume.basics),
        sections: JSON.stringify(resume.sections),
        metadata: JSON.stringify(resume.metadata),
        public: resume.public
      });
      toast.success("Saved Resume Successfully");
    } catch (error) {
      toast.error("Failed to save the resume.");
    }
    handleClose();
  }


  return (
    <>
      {isLoading ? (<div>loading...</div>) : (
        <div className="bg-white shadow-sm absolute top-0 left-0 right-0 z-10">
          <div
            className={`${styles.header} ${left.open ? styles.pushLeft : ''} ${right.open ? styles.pushRight : ''}`}
          >
            <Button size="icon" variant="ghost" onClick={toggleLeftSidebar} className="p-2">
              {left.open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Button>
            <div className={styles.title}>
              <button className="p-2 opacity-50 hover:opacity-100" onClick={goBack}>
                <HomeIcon />
              </button>

              <span className="opacity-50">{'/'}</span>

              <h1>{name} &nbsp;</h1>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <KeyboardArrowDownIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
                  <DropdownMenuItem onClick={onClickedBtnResumeSave} >
                    <Save className="scale-90" />&nbsp;Save Resume
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button size="icon" variant="ghost" onClick={toggleRightSidebar}>{right.open ? <ChevronRightIcon /> : <ChevronLeftIcon />}</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
