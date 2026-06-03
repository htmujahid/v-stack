import { Shell } from '@/components/layout/shell';
import { CreateRoleForm } from '@/components/organization/create-role-form';

export default function CreateRolePage() {
  return (
    <Shell className="max-w-2xl">
      <CreateRoleForm />
    </Shell>
  );
}
