import type { SearchParams } from 'nuqs/server';

import { TasksTable } from '@/components/tasks/tasks-table';
import {
  loadTasksSearchParams,
  tasksSearchToListInput,
} from '@/components/tasks/tasks-search-params';
import { HydrateClient, getQueryClient } from '@/lib/query/hydration';
import { orpc } from '@/orpc';

interface TasksPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await loadTasksSearchParams(searchParams);
  const listInput = tasksSearchToListInput(params);

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    orpc.tasks.list.queryOptions({ input: listInput }),
  );

  return (
    <div className="container mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <HydrateClient client={queryClient}>
        <TasksTable />
      </HydrateClient>
    </div>
  );
}
