import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bug,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  FileText,
  Lightbulb,
  Sparkles,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

import {
  taskLabels,
  taskPriorities,
  taskStatuses,
  type TaskLabel,
  type TaskPriority,
  type TaskStatus,
} from '@/db/schema/task-schema';

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost';

export const statusMeta: Record<
  TaskStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  todo: {
    label: 'Todo',
    icon: CircleDashed,
    className: 'text-muted-foreground',
  },
  'in-progress': {
    label: 'In Progress',
    icon: CircleDot,
    className: 'text-blue-500',
  },
  done: {
    label: 'Done',
    icon: CheckCircle2,
    className: 'text-emerald-500',
  },
  canceled: {
    label: 'Canceled',
    icon: XCircle,
    className: 'text-destructive',
  },
};

export const priorityMeta: Record<
  TaskPriority,
  { label: string; icon: LucideIcon; variant: BadgeVariant }
> = {
  low: { label: 'Low', icon: ArrowDown, variant: 'secondary' },
  medium: { label: 'Medium', icon: ArrowRight, variant: 'outline' },
  high: { label: 'High', icon: ArrowUp, variant: 'destructive' },
};

export const labelMeta: Record<
  TaskLabel,
  { label: string; icon: LucideIcon; variant: BadgeVariant }
> = {
  bug: { label: 'Bug', icon: Bug, variant: 'destructive' },
  feature: { label: 'Feature', icon: Sparkles, variant: 'default' },
  enhancement: { label: 'Enhancement', icon: Lightbulb, variant: 'secondary' },
  documentation: { label: 'Docs', icon: FileText, variant: 'outline' },
};

export const statusOptions = taskStatuses.map((value) => ({
  value,
  ...statusMeta[value],
}));

export const priorityOptions = taskPriorities.map((value) => ({
  value,
  ...priorityMeta[value],
}));

export const labelOptions = taskLabels.map((value) => ({
  value,
  ...labelMeta[value],
}));
