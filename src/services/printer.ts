import axios from './axios';

export type PrintResumeAsPdfParams = {
  username?: string;
  id: string;
};

export const printResumeAsPdf = (printResumeAsPdfParams: PrintResumeAsPdfParams): Promise<string> =>
  axios
    .get(
      `/print?id=${printResumeAsPdfParams.id}`,
    )
    .then((res) => res.data);
