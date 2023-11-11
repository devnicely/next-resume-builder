import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/common/Tooltip";
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { Photo, Resume } from '~/schema';

import { ServerError } from '~/services/axios';
import { deletePhoto, DeletePhotoParams, uploadPhoto, UploadPhotoParams } from '~/services/resume';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setResumeState } from '~/store/resume/resumeSlice';
import { Button } from '~/components/common/button';
import { Skeleton } from "~/components/common/skeleton";

const FILE_UPLOAD_MAX_SIZE = 2000000; // 2 MB

const PhotoUpload: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const id: number = useAppSelector((state) => get(state.resume.present, 'id'));
  const photo: Photo = useAppSelector((state) => get(state.resume.present, 'basics.photo'));
  

  const { mutateAsync: uploadMutation, isLoading } = useMutation<Resume, ServerError, UploadPhotoParams>(uploadPhoto);

  const { mutateAsync: deleteMutation } = useMutation<Resume, ServerError, DeletePhotoParams>(deletePhoto);

  const handleClick = async () => {
    if (fileInputRef.current) {
      if (!isEmpty(photo.url)) {
        try {
          const resume = await deleteMutation({ id });
          dispatch(setResumeState({ path: 'updatedAt', value: get(resume, 'updatedAt', '') }));
        } finally {
          dispatch(setResumeState({ path: 'basics.photo.url', value: '' }));
        }
      } else {
        fileInputRef.current.click();
      }

      fileInputRef.current.value = '';
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > FILE_UPLOAD_MAX_SIZE) {
        toast.error(t('common.toast.error.upload-photo-size'));
        return;
      }

      const resume = await uploadMutation({ id, file });

      dispatch(setResumeState({ path: 'basics.photo.url', value: get(resume, 'basics.photo.url', '') }));
      dispatch(setResumeState({ path: 'updatedAt', value: get(resume, 'updatedAt', '') }));
    }
  };

  
  return (
    <Button size="icon" onClick={handleClick}>
      {isLoading ? (
        <Skeleton className="h-12 w-12 rounded-full" />
      ) : (

        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Avatar</Button>
          </TooltipTrigger>
          <TooltipContent className="bg-zinc-700 text-white">
            <p>Upload Photo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

        // <Tooltip
        //   title={
        //     isEmpty(photo.url)
        //       ? 'Upload Photo'
        //       : 'Remove Photo'
        //   }
        // >
        //   <Avatar sx={{ width: 96, height: 96 }} src={photo.url} />
        // </Tooltip>
      )}

      <input hidden type="file" ref={fileInputRef} onChange={handleChange} accept="image/*" />
    </Button>
  );
};

export default PhotoUpload;
