import { PhotoFilter } from '@mui/icons-material';
import { Button, Divider, Popover } from '@mui/material';
import { useState } from 'react';

import ResumeInput from '~/components/shared/ResumeInput';
import { useTranslation } from 'next-i18next';
import PhotoFilters from './PhotoFilters';
import PhotoUpload from './PhotoUpload';

const Basics = () => {
  
  const { t } = useTranslation();
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
            <ResumeInput label="Full Name" path="basics.name" />

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

        <ResumeInput
          type="date"
          label="Date of Birth"
          path="basics.birthdate"
          className="sm:col-span-2"
        />
        <ResumeInput label="Email Address" path="basics.email" className="sm:col-span-2" />
        <ResumeInput label="Phone Number" path="basics.phone" />
        <ResumeInput label="Website" path="basics.website" />

        <Divider className="sm:col-span-2" />

        <ResumeInput
          label="Headline"
          path="basics.headline"
          className="sm:col-span-2"
        />
        <ResumeInput
          type="textarea"
          label="Summary"
          path="basics.summary"
          className="sm:col-span-2"
          markdownSupported
        />
      </div>
    </>
  );
};

export default Basics;
