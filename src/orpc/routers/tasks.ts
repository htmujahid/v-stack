import { ORPCError } from '@orpc/server';
import { z } from 'zod';

import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from '@/db/queries/tasks';
import { o } from '@/orpc/context';
import { authMiddleware } from '@/orpc/middlewares';
import {
  createTaskSchema,
  deleteTaskSchema,
  getTaskSchema,
  listTasksResponseSchema,
  listTasksSchema,
  taskSchema,
  updateTaskSchema,
} from '@/validators/tasks';

const protectedRoute = o.use(authMiddleware({ role: 'user' }));

export const tasksRouter = {
  list: protectedRoute
    .route({
      method: 'GET',
      path: '/tasks',
      summary: 'List Tasks',
      description: 'List the current user tasks',
      tags: ['Tasks'],
    })
    .input(listTasksSchema)
    .output(listTasksResponseSchema)
    .handler(({ input, context }) => listTasks(context.user.id, input)),

  get: protectedRoute
    .route({
      method: 'GET',
      path: '/tasks/{id}',
      summary: 'Get Task',
      description: 'Get a task by id',
      tags: ['Tasks'],
    })
    .input(getTaskSchema)
    .output(taskSchema)
    .handler(async ({ input, context }) => {
      const row = await getTaskById(context.user.id, input.id);
      if (!row) {
        throw new ORPCError('NOT_FOUND', { message: 'Task not found' });
      }
      return row;
    }),

  create: protectedRoute
    .route({
      method: 'POST',
      path: '/tasks',
      summary: 'Create Task',
      description: 'Create a new task',
      tags: ['Tasks'],
    })
    .input(createTaskSchema)
    .output(taskSchema)
    .handler(({ input, context }) => createTask(context.user.id, input)),

  update: protectedRoute
    .route({
      method: 'PATCH',
      path: '/tasks/{id}',
      summary: 'Update Task',
      description: 'Update an existing task',
      tags: ['Tasks'],
    })
    .input(updateTaskSchema)
    .output(taskSchema)
    .handler(async ({ input, context }) => {
      const row = await updateTask(context.user.id, input);
      if (!row) {
        throw new ORPCError('NOT_FOUND', { message: 'Task not found' });
      }
      return row;
    }),

  delete: protectedRoute
    .route({
      method: 'DELETE',
      path: '/tasks/{id}',
      summary: 'Delete Task',
      description: 'Delete a task',
      tags: ['Tasks'],
    })
    .input(deleteTaskSchema)
    .output(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const row = await deleteTask(context.user.id, input.id);
      if (!row) {
        throw new ORPCError('NOT_FOUND', { message: 'Task not found' });
      }
      return row;
    }),
};
