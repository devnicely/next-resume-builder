import { Input as TextField } from 'src/components/common/input';
import { Label } from 'src/components/common/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'src/components/common/popover';

import { cn } from 'src/components/common/Classnames';

import React, { useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import { hexColorPattern } from '~/config/colors';

import ColorAvatar from './ColorAvatar';

type Props = {
  label: string;
  color: string;
  className?: string;
  onChange: (color: string) => void;
};

const ColorPicker: React.FC<Props> = ({ label, color, onChange, className }) => {
  const isValid = useMemo(() => hexColorPattern.test(color), [color]);

  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (hexColorPattern.test(event.target.value)) {
      onChange(event.target.value);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Label>
            {label}
            <TextField
            value={color}
            onClick={handleOpen}
            onChange={handleChange}
            className={cn("mt-1",className)}
          />
          </Label>
        </PopoverTrigger>
        <PopoverContent className='w-full h-full p-0.5'>
          <HexColorPicker color={color} onChange={onChange} className="overflow-hidden" />
        </PopoverContent>

      </Popover>
      {/*      
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <HexColorPicker color={color} onChange={onChange} className="overflow-hidden" />
      </Popover> */}
    </>
  );
};

export default ColorPicker;
