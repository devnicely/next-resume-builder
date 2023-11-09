import { PhotoFilter } from '@mui/icons-material';
import { Button, Divider, Popover } from '@mui/material';
import { useState } from 'react';

import ResumeInput from '~/components/shared/ResumeInput';
import PhotoFilters from './PhotoFilters';
import PhotoUpload from './PhotoUpload';


const Basics = () => {

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid items-center gap-4 sm:col-span-2 sm:grid-cols-3">
          <div className="mx-auto">
            <PhotoUpload />
          </div>


          <div className="grid w-full gap-2 sm:col-span-2">
            <Button variant="outlined" startIcon={<PhotoFilter />} onClick={handleClick}>
              Logo style
            </Button>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <PhotoFilters />
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export default Basics;
