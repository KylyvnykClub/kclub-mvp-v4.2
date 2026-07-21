import { redirect } from 'next/navigation';

type SettingsRouteProps = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsRoute({ params }: SettingsRouteProps) {
  const { locale } = await params;

  redirect(`/${locale}/dashboard/profile`);
}
