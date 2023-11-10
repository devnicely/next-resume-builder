import { Wand } from 'lucide-react';
import { Button } from '~/components/common/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'src/components/common/popover';

import PhotoFilters from './PhotoFilters';
import PhotoUpload from './PhotoUpload';

const Basics = () => {
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
