'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  taskStatuses,
  type TaskStatus,
} from '@/db/schema/task-schema';

import { statusMeta } from './task-meta';

interface TaskStatusSelectProps {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
  disabled?: boolean;
}

export function TaskStatusSelect({
  value,
  onChange,
  disabled,
}: TaskStatusSelectProps) {
  const Icon = statusMeta[value].icon;
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as TaskStatus);
      }}
      disabled={disabled}
    >
      <SelectTrigger size="sm" className="w-[150px]">
        <span className="flex items-center gap-2">
          <Icon className={`size-3.5 ${statusMeta[value].className}`} />
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        {taskStatuses.map((status) => {
          const meta = statusMeta[status];
          const StatusIcon = meta.icon;
          return (
            <SelectItem key={status} value={status}>
              <StatusIcon className={`size-4 ${meta.className}`} />
              {meta.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
