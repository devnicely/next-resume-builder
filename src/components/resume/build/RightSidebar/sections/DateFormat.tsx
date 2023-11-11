import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/common/select";
import Heading from "~/components/shared/Heading";
<<<<<<< HEAD

const DateFormat = () => {

    const onChangedDateFormat = (val: string) => {
        alert(val);
=======
import { useAppDispatch } from "~/store/hooks";
import { setResumeState } from "~/store/resume/resumeSlice";
import { dateFormatOptions } from "~/utils/date";

const DateFormat = () => {

    const dispatch = useAppDispatch();
    
    const onChangedDateFormat = (value: string) => {
        dispatch(setResumeState({ path: 'metadata.date.format', value }));
>>>>>>> main
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
<<<<<<< HEAD
                            <SelectItem value="yy-mm (22-12)">yy-mm (22-12)</SelectItem>
                            <SelectItem value="mm-yy (12-22)">mm-yy (12-22)</SelectItem>
                            <SelectItem value="MMM YYYY (Dec 2022)">MMM YYYY (Dec 2022)</SelectItem>
                            <SelectItem value="Month YYYY (December 2022)">Month YYYY (December 2022)</SelectItem>
                            <SelectItem value="MMM YY (Dec 22)">MMM YY (Dec 22)</SelectItem>
=======
                            {
                                dateFormatOptions.map((option) => <SelectItem value={option}>{option}</SelectItem>)
                            }
>>>>>>> main
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}

export default DateFormat;