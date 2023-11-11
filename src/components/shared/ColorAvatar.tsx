import { Avatar } from '@mui/material';
// import { Avatar, AvatarFallback, AvatarImage } from "~/components/common/avatar";

import {  } from 'lucide-react';
import isFunction from 'lodash/isFunction';
import { Button } from '../common/button';

type Props = {
  color: string;
  size?: number;
  onClick?: (color: string) => void;
};

const ColorAvatar: React.FC<Props> = ({ color, size = 20, onClick }) => {
  const handleClick = () => isFunction(onClick) && onClick(color);

  return (
    <Button size="icon" onClick={handleClick}>
      <Avatar sx={{ bgcolor: color, width: size, height: size }}>&nbsp;</Avatar>
    </Button>

  //   <Avatar>
  //   <AvatarImage src="https://github.com/shadcn.png" />
  //   <AvatarFallback>CN</AvatarFallback>
  // </Avatar>
  );
};

export default ColorAvatar;
