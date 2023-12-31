import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  ChevronDown as KeyboardArrowDownIcon,
  Save,
} from 'lucide-react';

import { Button } from '~/components/common/button';
import get from 'lodash/get';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { setSidebarState, toggleSidebar } from '~/store/build/buildSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import styles from './Header.module.scss';


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

  return (
    <>
      {/* <div className="bg-white shadow-sm fixed top-[63px] left-[100px] right-[38px] z-10"> */}
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
            </div>
            <Button size="icon" variant="ghost" onClick={toggleRightSidebar}>{right.open ? <ChevronRightIcon /> : <ChevronLeftIcon />}</Button>
          </div>
        </div>
    </>
  );
};

export default Header;
