import { redirect } from 'next/navigation';
import { readStaffSession } from '../../../server/admin-api';
import { AdminShell } from '../../../features/shell/admin-shell';
import { PartnerDetail } from '../../../features/partners/partner-detail';

export default async function PartnerDetailPage() {
  const session = await readStaffSession();
  if (session === null) redirect('/sign-in');
  return (
    <AdminShell session={session}>
      <PartnerDetail />
    </AdminShell>
  );
}
