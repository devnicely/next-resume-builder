"use client"

import * as React from "react"
import { format } from "date-fns"
import dayjs from 'dayjs';
import { Calendar as CalendarIcon, Construction } from "lucide-react"

import { cn } from "~/components/common/Classnames"
import { Button } from "~/components/common/button"
import { Calendar } from "./calendar/index"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover/index"

type DatePickerProps = {
  fromYear: number,
  toYear: number,
  text: string,
  value: dayjs.Dayjs | null;
  onChange: (date: dayjs.Dayjs | null) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({fromYear, toYear, text, onChange, ...props}) => {

  const [date, setDate] = React.useState<Date>() 

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-between text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(date, "MM/dd/yyyy") : <span>{text}</span>}
            <CalendarIcon className={"h-4 w-4"} />

          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="dropdown-buttons"
            selected={date}
            onSelect={(date) => {
              onChange(date ? dayjs(date) : null);
              setDate(date);
            }}
            fromYear={fromYear}
            toYear={toYear}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}

