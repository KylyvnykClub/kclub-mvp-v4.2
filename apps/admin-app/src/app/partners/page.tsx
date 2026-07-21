import { redirect } from 'next/navigation';
import { readStaffSession } from '../../server/admin-api';
import { AdminShell } from '../../features/shell/admin-shell';
import { PartnersList } from '../../features/partners/partners-list';

export default async function PartnersPage() {
  const session = await readStaffSession();
  if (session === null) redirect('/sign-in');
  return (
    <AdminShell session={session}>
      <PartnersList />
    </AdminShell>
  );
}
