import { Shell } from '@/components/layout/shell';
import { CreateTeamForm } from '@/components/organization/create-team-form';

export default function CreateTeamPage() {
  return (
    <Shell className="max-w-2xl">
      <CreateTeamForm />
    </Shell>
  );
}
