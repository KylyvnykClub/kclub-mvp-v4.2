import { hasLocale } from 'next-intl';
import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '../../../i18n/routing';
import { createClient } from '../../../lib/supabase/server';
import { prisma } from '../../../lib/supabase/db';
import { DashboardSidebar } from '../../../features/dashboard/components/DashboardSidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const member = await prisma.member.findUnique({
    where: { supabaseUserId: user.id },
  });

  if (!member) {
    redirect(`/${locale}/auth/login`);
  }

  const memberName = member.displayName || `${member.firstName} ${member.lastName}`;
  const memberInitials = `${member.firstName[0]}${member.lastName[0]}`;

  return (
    <div className="kc-dashboard">
      <DashboardSidebar
        locale={locale}
        memberName={memberName}
        memberInitials={memberInitials}
      />
      <main className="kc-dashboard-main">{children}</main>
    </div>
  );
}
