import { redirect } from 'next/navigation';
import { readStaffSession } from '../../../../server/admin-api';
import { AdminShell } from '../../../../features/shell/admin-shell';
import { PartnerForm } from '../../../../features/partners/partner-form';

export default async function PartnerEditPage() {
  const session = await readStaffSession();
  if (session === null) redirect('/sign-in');
  return (
    <AdminShell session={session}>
      <PartnerForm />
    </AdminShell>
  );
}
