import { AxiosResponse } from 'axios';
import axios from './axios';

export type FileUploadResponeParams = {
  filename: string;
}

export type CreateResumeParams = {
  name: string;
  slug: string;
  public: boolean;
};

export type UploadPhotoParams = {
  id: number;
  file: File;
};

export const uploadPhoto = async (uploadPhotoParams: UploadPhotoParams) => {
  const formData = new FormData();
  formData.append('file', uploadPhotoParams.file);
  return axios
    // .put<Resume, AxiosResponse<Resume>, FormData>(`/api/${uploadPhotoParams.id}/photo`, formData)
    .put<FileUploadResponeParams, AxiosResponse<FileUploadResponeParams>, FormData>(`/photo`, formData)
    .then((res) => res.data);
};

