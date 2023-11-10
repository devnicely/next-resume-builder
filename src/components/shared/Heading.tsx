
import { Check, Eye, EyeOff, PencilLine, Trash2, Star } from 'lucide-react';

import clsx from 'clsx';
import get from 'lodash/get';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import sections from '~/config/sections';

import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { deleteSection, setResumeState } from '~/store/resume/resumeSlice';

import styles from './Heading.module.scss';
import { Input } from '../common/input';
import { Button } from '../common/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../common/Tooltip";

type Props = {
  path: string;
  name?: string;
  isEditable?: boolean;
  isHideable?: boolean;
  isDeletable?: boolean;
  action?: React.ReactNode;
  className?: string;
};

const Heading: React.FC<Props> = ({
  path,
  name,
  isEditable = false,
  isHideable = false,
  isDeletable = false,
  action,
}) => {

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const heading = useAppSelector((state) => get(state.resume.present, `${path}.name`, name));
  const visibility = useAppSelector((state) => get(state.resume.present, `${path}.visible`, true));

  const [editMode, setEditMode] = useState(false);

  const id = useMemo(() => path.split('.')[1], [path]);

  const icon = sections.find((x) => x.id === id)?.icon || <Star />;

  const toggleVisibility = () => {
    dispatch(setResumeState({ path: `${path}.visible`, value: !visibility }));
  };

  const toggleEditMode = () => setEditMode(!editMode);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setResumeState({ path: `${path}.name`, value: event.target.value }));
  };

  const handleDelete = () => {
    dispatch(deleteSection({ path }));
  };

  return (
    <div className={styles.container}>
      <div className="flex w-full items-center gap-3">
        {editMode ? (
          <Input value={heading} className="w-3/4 h-10 text-base sm:w-52" onChange={handleChange} />
        ) : (
          <h2 className='text-[#35818E]'>{heading}</h2>
        )}
      </div>

      <div
        className={clsx(styles.actions, {
          '!opacity-75': editMode,
        })}
      >
        {isEditable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button size={"icon"}  className="w-7" variant={"ghost"} onClick={toggleEditMode}>
                  {editMode ? <Check /> : <PencilLine />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rename Section</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {isHideable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button size={"icon"} className="w-7" variant={"ghost"} onClick={toggleVisibility}>
                  {visibility ? <Eye /> : <EyeOff />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Visibility</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {isDeletable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button size={"icon"} variant={"ghost"} onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 text-primary-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Section</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {action}
      </div>
    </div>
  );
};

export default Heading;
