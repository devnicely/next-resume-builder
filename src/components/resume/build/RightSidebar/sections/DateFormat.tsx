import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/common/select";
import Heading from "~/components/shared/Heading";

const DateFormat = () => {

    const onChangedDateFormat = (val: string) => {
        alert(val);
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
                            <SelectItem value="apple">yy-mm (22-12)</SelectItem>
                            <SelectItem value="banana">mm-yy (12-22)</SelectItem>
                            <SelectItem value="blueberry">MMM YYYY (Dec 2022)</SelectItem>
                            <SelectItem value="grapes">Month YYYY (December 2022)</SelectItem>
                            <SelectItem value="pineapple">MMM YY (Dec 22)</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}

export default DateFormat;