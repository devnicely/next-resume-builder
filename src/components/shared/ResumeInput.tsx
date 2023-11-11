import { Label } from 'src/components/common/label';
import { Input } from 'src/components/common/input';
import { Textarea } from 'src/components/common/textarea';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DatePicker } from '~/components/date-picker/date-picker';

import { cn } from "src/components/common/Classnames";
import dayjs from 'dayjs';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setResumeState } from '~/store/resume/resumeSlice';
import MarkdownSupported from './MarkdownSupported';
import { YearPicker } from '../date-picker/year-picker';



interface Props {
  type?: 'text' | 'textarea' | 'date' | 'year';
  label: string;
  path: string;
  className?: string;
  markdownSupported?: boolean;
}

const ResumeInput: React.FC<Props> = ({ type = 'text', label, path, className, markdownSupported = false }) => {


  const dispatch = useAppDispatch();

  const stateValue = useAppSelector((state) => get(state.resume.present, path, ''));

  useEffect(() => {
    setValue(stateValue);
  }, [stateValue]);

  const [value, setValue] = useState<string>(stateValue);

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(event.target.value);
    dispatch(setResumeState({ path, value: event.target.value }));
  };

  const onChangeValue = (value: string) => {
    console.log("===== picked date====", value);
    setValue(value);
    dispatch(setResumeState({ path, value }));
  };

  if (type === 'textarea') {
    return (
      <Textarea
        label={label}
        value={value}
        onChange={onChange}
        className={className}
        helperText={markdownSupported && <MarkdownSupported />}
      />
    );
  }

  if (type === 'date') {
    return (
      <div className={cn("grid w-full items-center gap-1.5", className)}>
        <Label>{label}</Label>
        <DatePicker
          fromYear={2000}
          toYear={2030}
          value={isEmpty(value) ? null : dayjs(value)}
          text={"Select Date"}
          onChange={(date: dayjs.Dayjs | null) => {
            if (!date) return onChangeValue('');
            if (dayjs(date).isValid()) return onChangeValue(dayjs(date).format('YYYY-MM-DD'));
          }}
        />
      </div>
    );
  }

  if (type === 'year') {
    return (
      <div className={cn("grid w-full items-center gap-1.5", className)}>
        <Label>{label}</Label>
        <YearPicker
          fromYear={2000}
          toYear={2030}
          text="Select Year"
          onChange={(year) => {
            return onChangeValue(year);
          }}
        />
      </div>
    )
  }

  // return <TextField type={type} label={label} value={value} onChange={onChange} className={className} />;
  return <div className={cn("grid w-full items-center gap-1.5", className)}>
    <Label>{label}</Label>
    <Input value={value} onChange={onChange}></Input>
  </div>
};

export default ResumeInput;
