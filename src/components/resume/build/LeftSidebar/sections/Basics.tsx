import { Wand } from 'lucide-react';
import { Button } from '~/components/common/button';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'src/components/common/popover';

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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleClick}
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
                  <Wand size="18" />&nbsp; Logo style
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-70 p-2 bg-zinc-600 text-white">
                <PhotoFilters />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export default Basics;
