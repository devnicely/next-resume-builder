import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/common/Tooltip";

import isEmpty from 'lodash/isEmpty';
import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { Photo, Resume } from '~/schema';
import { ServerError } from '~/services/axios';
import { FileUploadResponeParams, uploadPhoto, UploadPhotoParams } from '~/services/resume';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setResumeState } from '~/store/resume/resumeSlice';
import { Button } from '~/components/common/button';
import { Skeleton } from "~/components/common/skeleton";
import { Avatar, Tooltip } from "@mui/material";

const FILE_UPLOAD_MAX_SIZE = 2000000; // 2 MB

const PhotoUpload: React.FC = () => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resume: Resume = useAppSelector((state) => state.resume.present);
  const id: number = resume.id;
  const photo: Photo = resume.basics.photo;
  const { mutateAsync: uploadMutation, isLoading, isError } = useMutation<FileUploadResponeParams, ServerError, UploadPhotoParams>(uploadPhoto);
  const handleClick = async () => {
    if (fileInputRef.current) {
      if (!isEmpty(photo.url)) {
        try {
          //const resume = await deleteMutation({ id });
          //dispatch(setResumeState({ path: 'updatedAt', value: get(resume, 'updatedAt', '') }));
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
        toast.error('Please upload only photos under 2 megabytes, preferably square.');
        return;
      }
      
      const result: FileUploadResponeParams = await uploadMutation({ id, file });
      if (!isError){
        const {filename} = result;
        const filepath = `/uploads/${filename}`;
        dispatch(setResumeState({ path: 'basics.photo.url', value: filepath }));
      }
      // dispatch(setResumeState({ path: 'updatedAt', value: get(resume, 'updatedAt', '') }));
    }
  };


  return (
    <Button className="mt-5" size="icon" onClick={handleClick}>
      {isLoading ? (
        <Skeleton className="h-12 w-12 rounded-full" />
      ) : (
        <Tooltip
          title={
            isEmpty(photo.url)
              ? 'Upload Photo'
              : 'Remove Photo'
          }
        >
          <Avatar sx={{ width: 96, height: 96 }} src={photo.url} />
        </Tooltip>
      )}

      <input hidden type="file" ref={fileInputRef} onChange={handleChange} accept="image/*" />
    </Button>
  );
};

export default PhotoUpload;
