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
  const [value, setValue] = React.useState("Метод");

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
          <SelectItem value="method">Метод</SelectItem>
          <SelectItem value="vid_iz">Вид изученности</SelectItem>
          <SelectItem value="god_nach">Начало работ</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
