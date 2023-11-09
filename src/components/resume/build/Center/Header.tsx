import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Save,
} from '@mui/icons-material';
import {
  AppBar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import get from 'lodash/get';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { setSidebarState, toggleSidebar } from '~/store/build/buildSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';

import { cn } from '~/utils/styles';

import styles from './Header.module.scss';
import { api } from '~/utils/api';


const Header = () => {
  const theme = useTheme();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

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
        recruiter: JSON.stringify(resume.recruiter),
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
        <AppBar elevation={0} position="absolute">
          <Toolbar
            variant="dense"
            className={cn({
              [styles.header]: true,
              [styles.pushLeft]: left.open,
              [styles.pushRight]: right.open,
            })}
          >
            <IconButton onClick={toggleLeftSidebar}>{left.open ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>

            <div className={styles.title}>
              <IconButton className="opacity-50 hover:opacity-100" onClick={goBack}>
                <HomeIcon color='primary' />
              </IconButton>

              <span className="opacity-50">{'/'}</span>

              <h1>{name}</h1>

              <IconButton onClick={handleClick}>
                <KeyboardArrowDownIcon />
              </IconButton>

              <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
                <MenuItem onClick={onClickedBtnResumeSave}>
                  <ListItemIcon>
                    <Save className="scale-90" />
                  </ListItemIcon>
                  <ListItemText>Save Resume</ListItemText>
                </MenuItem>

              </Menu>
            </div>

            <IconButton onClick={toggleRightSidebar}>{right.open ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default Header;
