import env from '@beam-australia/react-env';
import { AxiosResponse } from 'axios';
import { Resume } from '~/schema';
import isBrowser from '~/utils/isBrowser';
import axios from './axios';

export type FileUploadResponeParams = {
  filename: string;
}

export type CreateResumeParams = {
  name: string;
  slug: string;
  public: boolean;
};

export type FetchResumeByIdentifierParams = {
  username: string;
  slug: string;
  options?: {
    secretKey?: string;
  };
};

export type FetchResumeByShortIdParams = {
  shortId: string;
};


export type LoadSampleDataParams = {
  id: number;
};

export type ResetResumeParams = {
  id: number;
};

export type UploadPhotoParams = {
  id: number;
  file: File;
};


export const fetchResumes = () => axios.get<Resume[]>('/resume').then((res) => res.data);
export const fetchResumeByIdentifier = async ({
  username,
  slug,
  options = { secretKey: '' },
}: FetchResumeByIdentifierParams) => {
  if (!isBrowser) {
    const serverUrl = env('SERVER_URL');
    const secretKey = options.secretKey;

    return fetch(`${serverUrl}/resume/${username}/${slug}?secretKey=${secretKey}`).then((response) => response.json());
  }

  return axios.get<Resume>(`/resume/${username}/${slug}`).then((res) => res.data);
};

export const fetchResumeByShortId = async ({ shortId }: FetchResumeByShortIdParams) =>
  axios.get<Resume>(`/resume/short/${shortId}`).then((res) => res.data);



export const createResume = (createResumeParams: CreateResumeParams) =>
  axios.post<Resume, AxiosResponse<Resume>, CreateResumeParams>('/resume', createResumeParams).then((res) => res.data);



export const updateResume = async (updateResumeParams: Partial<Resume>) => {
  
}

export const loadSampleData = (loadSampleDataParams: LoadSampleDataParams) =>
  axios
    .post<Resume, AxiosResponse<Resume>, LoadSampleDataParams>(`/resume/${loadSampleDataParams.id}/sample`)
    .then((res) => res.data);

export const resetResume = (resetResumeParams: ResetResumeParams) =>
  axios
    .post<Resume, AxiosResponse<Resume>, ResetResumeParams>(`/resume/${resetResumeParams.id}/reset`)
    .then((res) => res.data);


export const uploadPhoto = async (uploadPhotoParams: UploadPhotoParams) => {
  const formData = new FormData();
  formData.append('file', uploadPhotoParams.file);
  return axios
    // .put<Resume, AxiosResponse<Resume>, FormData>(`/api/${uploadPhotoParams.id}/photo`, formData)
    .put<FileUploadResponeParams, AxiosResponse<FileUploadResponeParams>, FormData>(`/photo`, formData)
    .then((res) => res.data);
};

