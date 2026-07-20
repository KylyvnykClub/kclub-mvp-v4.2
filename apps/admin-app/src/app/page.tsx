import { redirect } from 'next/navigation';
import { readStaffSession } from '../server/admin-api';
import { AdminShell } from '../features/shell/admin-shell';
import { AdminOverview } from '../features/dashboard/admin-overview';

export default async function AdminHomePage() {
  const session = await readStaffSession();
  if (session === null) redirect('/sign-in');
  return (
    <AdminShell session={session}>
      <AdminOverview staff={session.staff} />
    </AdminShell>
  );
}
