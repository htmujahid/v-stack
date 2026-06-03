'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface TasksTableHeadingProps {
  total: number;
  fromRow: number;
  toRow: number;
  isLoading: boolean;
  onCreate: () => void;
}

export function TasksTableHeading({
  total,
  fromRow,
  toRow,
  isLoading,
  onCreate,
}: TasksTableHeadingProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {isLoading
            ? 'Loading tasks...'
            : total === 0
              ? 'No tasks match your filters.'
              : `Showing ${fromRow}-${toRow} of ${total}`}
        </p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="size-4" />
        New task
      </Button>
    </div>
  );
}
