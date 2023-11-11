import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/common/select";
import { ScrollArea } from "../common/scroll-area";

type YearPickerProps = {
    fromYear: number,
    toYear: number,
    text: string,
    onChange: (year: string) => void,
}

export const YearPicker: React.FC<YearPickerProps> = ({ fromYear, toYear, text, onChange, ...props }) => {

    const yearRange = Array.from({ length: toYear - fromYear + 1 }, (_, index) => fromYear + index);
    return (
        <Select onValueChange={(value) => {onChange(value)}} defaultValue={(new Date().getFullYear()).toString()}>
            <SelectTrigger className="">
                <SelectValue placeholder={text} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <ScrollArea className="h-80">
                        {yearRange.map((year) => (
                            <SelectItem value={year.toString()} key={year}>{year}</SelectItem>
                        ))}
                    </ScrollArea>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

