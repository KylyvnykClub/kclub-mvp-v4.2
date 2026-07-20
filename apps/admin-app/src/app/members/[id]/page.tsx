import { redirect } from 'next/navigation';
import { readStaffSession } from '../../../server/admin-api';
import { AdminShell } from '../../../features/shell/admin-shell';
import { MemberDetail } from '../../../features/members/member-detail';

export default async function MemberDetailPage() {
  const session = await readStaffSession();
  if (session === null) redirect('/sign-in');
  return (
    <AdminShell session={session}>
      <MemberDetail />
    </AdminShell>
  );
}
