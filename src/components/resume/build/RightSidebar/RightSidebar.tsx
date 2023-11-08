import { SwipeableDrawer, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { right } from '~/config/sections';
import { setSidebarState } from '~/store/build/buildSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';

import styles from './RightSidebar.module.scss';

const RightSidebar = () => {
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const { open } = useAppSelector((state) => state.build.sidebar.right);

  const handleOpen = () => dispatch(setSidebarState({ sidebar: 'right', state: { open: true } }));

  const handleClose = () => dispatch(setSidebarState({ sidebar: 'right', state: { open: false } }));

  const handleClick = (id: string) => {
    const section = document.querySelector(`#${id}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  return (
    <SwipeableDrawer
      open={open}
      anchor="right"
      onOpen={handleOpen}
      onClose={handleClose}
      PaperProps={{ className: '!shadow-lg' }}
      variant={isDesktop ? 'persistent' : 'temporary'}
    >
      <div className={styles.container}>
        <main>
          {right.map(({ id, component }) => (
            <section key={id} id={id}>
              {component}
            </section>
          ))}
        </main>
      </div>
    </SwipeableDrawer>
  );
};

export default RightSidebar;
