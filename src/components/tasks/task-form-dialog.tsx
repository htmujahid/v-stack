'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  taskLabels,
  taskPriorities,
  taskStatuses,
  type TaskLabel,
  type TaskPriority,
  type TaskStatus,
} from '@/db/schema/task-schema';
import { orpc } from '@/orpc';

import {
  labelOptions,
  priorityOptions,
  statusOptions,
} from './task-meta';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities),
  label: z.enum(taskLabels),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export interface TaskFormDialogTask {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  label: TaskLabel;
}

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskFormDialogTask | null;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
}: TaskFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(task);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      label: 'feature',
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status ?? 'todo',
        priority: task?.priority ?? 'medium',
        label: task?.label ?? 'feature',
      });
    }
  }, [open, task, form]);

  const createMutation = useMutation(
    orpc.tasks.create.mutationOptions({
      onSuccess: async () => {
        toast.success('Task created');
        await queryClient.invalidateQueries({
          queryKey: orpc.tasks.list.key(),
        });
        onOpenChange(false);
      },
    }),
  );

  const updateMutation = useMutation(
    orpc.tasks.update.mutationOptions({
      onSuccess: async () => {
        toast.success('Task updated');
        await queryClient.invalidateQueries({
          queryKey: orpc.tasks.list.key(),
        });
        onOpenChange(false);
      },
    }),
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: TaskFormValues) => {
    const payload = {
      ...values,
      description: values.description?.trim() ? values.description : null,
    };
    if (isEdit && task) {
      await updateMutation.mutateAsync({ id: task.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit task' : 'New task'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details of your task.'
              : 'Add a new task to your list.'}
          </DialogDescription>
        </DialogHeader>
        <form
          id="task-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="What needs to be done?"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={4}
                  placeholder="Add more context (optional)"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <opt.icon className={`size-4 ${opt.className}`} />
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="priority"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <opt.icon className="size-4" />
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="label"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Label</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {labelOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <opt.icon className="size-4" />
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="task-form" disabled={isSubmitting}>
            {isSubmitting
              ? isEdit
                ? 'Saving...'
                : 'Creating...'
              : isEdit
                ? 'Save changes'
                : 'Create task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
