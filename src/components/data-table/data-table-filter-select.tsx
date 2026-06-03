'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface DataTableFilterOption {
  value: string;
  label: string;
}

interface DataTableFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: DataTableFilterOption[];
  allValue?: string;
  allLabel?: string;
  triggerClassName?: string;
}

export function DataTableFilterSelect({
  value,
  onChange,
  placeholder,
  options,
  allValue = 'all',
  allLabel,
  triggerClassName = 'w-[140px]',
}: DataTableFilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v);
      }}
    >
      <SelectTrigger size="sm" className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={allValue}>
          {allLabel ?? `All ${placeholder.toLowerCase()}`}
        </SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
