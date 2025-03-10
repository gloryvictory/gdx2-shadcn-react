import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFilterProps {
  onChange: (value: string) => void;
}

export function SelectFilter({ onChange }: SelectFilterProps) {
  const [value, setValue] = React.useState("apple");

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue); // Вызываем callback с новым значением
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Выбрать фильтр" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Фильтры</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
