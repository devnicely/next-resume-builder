import { useEffect, useState } from 'react';
import { right } from '~/config/sections';
import { setSidebarState } from '~/store/build/buildSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import styles from './RightSidebar.module.scss';
import { TemplateType } from '~/constants';

const RightSidebar = () => {

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

  const { open } = useAppSelector((state) => state.build.sidebar.right);
  const handleOpen = () => dispatch(setSidebarState({ sidebar: 'right', state: { open: true } }));
  const handleClose = () => dispatch(setSidebarState({ sidebar: 'right', state: { open: false } }));
  const handleClick = (id: string) => {
    const section = document.querySelector(`#${id}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resume = useAppSelector((state) => state.resume.present);

  const sections = () => {
    const rightSidebar = right.map(({ id, component, kind }) => {
      if (resume.type != TemplateType.RESUME) {
        if (kind == resume.type || kind == TemplateType.BOTH)
          return (
            <section key={id} id={id}>
              {component}
            </section>
          )
      } else {
        if (id === 'layout')
          return (
            <section key={id} id={id}>
              {component}
            </section>
          )
      }
    })
    return rightSidebar;
  }

  return (
    <div className={`absolute top-0 bottom-0 right-0 bg-white z-20 ${open ? 'block' : 'hidden'}`}>
      <div className={styles.container}>
        <main>
          {sections()}
        </main>
      </div>
    </div>
  );
};

export default RightSidebar;
