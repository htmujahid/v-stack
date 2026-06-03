'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { orpc } from '@/orpc';

interface DeleteTaskDialogProps {
  taskId: string | null;
  taskTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTaskDialog({
  taskId,
  taskTitle,
  open,
  onOpenChange,
}: DeleteTaskDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    orpc.tasks.delete.mutationOptions({
      onSuccess: async () => {
        toast.success('Task deleted');
        await queryClient.invalidateQueries({
          queryKey: orpc.tasks.list.key(),
        });
        onOpenChange(false);
      },
    }),
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete
            {taskTitle ? ` "${taskTitle}"` : ' this task'}. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={!taskId || deleteMutation.isPending}
            onClick={() => {
              if (!taskId) return;
              deleteMutation.mutate({ id: taskId });
            }}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
