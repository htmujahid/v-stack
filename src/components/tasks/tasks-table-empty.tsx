'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty';

interface TasksTableEmptyProps {
  hasActiveFilters: boolean;
  onCreate: () => void;
}

export function TasksTableEmpty({
  hasActiveFilters,
  onCreate,
}: TasksTableEmptyProps) {
  return (
    <Empty className="py-12">
      <EmptyTitle>No tasks found</EmptyTitle>
      <EmptyDescription>
        {hasActiveFilters
          ? 'Try adjusting your filters.'
          : 'Create your first task to start tracking work.'}
      </EmptyDescription>
      <Button className="mt-4" onClick={onCreate}>
        <Plus className="size-4" />
        New task
      </Button>
    </Empty>
  );
}
