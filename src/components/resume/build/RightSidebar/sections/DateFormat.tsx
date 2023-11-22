import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/common/select";
import Heading from "~/components/shared/Heading";
import { useAppDispatch } from "~/store/hooks";
import { setResumeState } from "~/store/resume/resumeSlice";
import { dateFormatOptions } from "~/utils/date";

const DateFormat = () => {

    const dispatch = useAppDispatch();
    
    const onChangedDateFormat = (value: string) => {
        dispatch(setResumeState({ path: 'metadata.date.format', value }));
    }

    return (
        <>
            <Heading path="metadata.layout" name="Date Format" />
            <div>
                <Select onValueChange={(value: string) => onChangedDateFormat(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                dateFormatOptions.map((option, i) => <SelectItem key={i} value={option}>{option}</SelectItem>)
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}

export default DateFormat;