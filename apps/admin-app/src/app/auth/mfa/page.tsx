import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthPage } from '../../../features/auth/auth-page';
import { CHALLENGE_COOKIE } from '../../../server/admin-api';

export default async function MfaPage() {
  if ((await cookies()).get(CHALLENGE_COOKIE) === undefined) redirect('/sign-in');
  return <AuthPage mode="mfa" />;
}
