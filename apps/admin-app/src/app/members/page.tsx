import { redirect } from 'next/navigation';
import { readStaffSession } from '../../server/admin-api';
import { AdminShell } from '../../features/shell/admin-shell';
import { MembersList } from '../../features/members/members-list';

export default async function MembersPage() {
  const session = await readStaffSession();
  if (session === null) redirect('/sign-in');
  return (
    <AdminShell session={session}>
      <MembersList />
    </AdminShell>
  );
}
