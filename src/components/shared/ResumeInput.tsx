import { Label } from 'src/components/common/label';
import { Input } from 'src/components/common/input';
import { Textarea } from 'src/components/common/textarea';
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

  const [value, setValue] = useState<string>(stateValue);
  const [text, setText] = useState<string>('Select Date');

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(event.target.value);
    dispatch(setResumeState({ path, value: event.target.value }));
  };

  const onChangeValue = (value: string) => {
    setValue(value);
    dispatch(setResumeState({ path, value }));
  };

  const handlePresent = () => {
    setValue('');
    setText('Present');
    dispatch(setResumeState({ path, value: '' }));

  }

  if (type === 'textarea') {
    return (
      <div className={cn("grid w-full items-center gap-1.5", className)}>
        <Label>{label}</Label>
        <Textarea
          value={value}
          onChange={onChange}
          className={className}
        />
      </div>
    );
  }

  if (type === 'date') {
    return (
      <div className={cn("grid w-full items-center gap-1.5", className)}>
        <Label>{label}</Label>
        <DatePicker
          fromYear={2000}
          toYear={2030}
          handlePresent={() => handlePresent()}
          value={isEmpty(value) ? null : dayjs(value)}
          text={text}
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
    <Label className='text-[11px]'>{label}</Label>
    <Input value={value} onChange={onChange}></Input>
  </div>
};

export default ResumeInput;