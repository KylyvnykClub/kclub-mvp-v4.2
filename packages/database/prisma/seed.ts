import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src';

const connectionString = process.env.DATABASE_URL;
if (connectionString === undefined) throw new Error('DATABASE_URL is required');

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

type PartnerTranslationEntry = { name: string; description: string };
type PartnerTranslations = Record<'en' | 'ru' | 'uk', PartnerTranslationEntry>;

type SeedPartner = {
  slug: string;
  category: 'ADVISORY' | 'FINANCE' | 'LEGAL' | 'TECHNOLOGY';
  country: 'GERMANY' | 'SWITZERLAND' | 'POLAND' | 'UKRAINE';
  discountPercent: number;
  image: string;
  sortOrder: number;
  translations: PartnerTranslations;
};

const partners: SeedPartner[] = [
  {
    slug: 'north-harbor-advisors',
    category: 'ADVISORY',
    country: 'GERMANY',
    discountPercent: 15,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=85',
    sortOrder: 0,
    translations: {
      en: { name: 'North Harbor Advisors', description: 'Strategic guidance for owners navigating growth, partnerships and complex long-term decisions.' },
      ru: { name: 'North Harbor Advisors', description: 'Стратегическая поддержка владельцев в вопросах роста, партнёрств и сложных долгосрочных решений.' },
      uk: { name: 'North Harbor Advisors', description: 'Стратегічна підтримка власників у питаннях зростання, партнерств і складних довгострокових рішень.' },
    },
  },
  {
    slug: 'meridian-family-office',
    category: 'FINANCE',
    country: 'SWITZERLAND',
    discountPercent: 10,
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=85',
    sortOrder: 1,
    translations: {
      en: { name: 'Meridian Family Office', description: 'Private-market perspective and considered financial support for founders and family enterprises.' },
      ru: { name: 'Meridian Family Office', description: 'Экспертиза частных рынков и взвешенная финансовая поддержка основателей и семейных компаний.' },
      uk: { name: 'Meridian Family Office', description: 'Експертиза приватних ринків і виважена фінансова підтримка засновників та сімейних компаній.' },
    },
  },
  {
    slug: 'loden-legal',
    category: 'LEGAL',
    country: 'POLAND',
    discountPercent: 20,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=85',
    sortOrder: 2,
    translations: {
      en: { name: 'Loden Legal', description: 'Commercial legal expertise for cross-border operations, transactions and responsible expansion.' },
      ru: { name: 'Loden Legal', description: 'Коммерческая юридическая экспертиза для международных операций, сделок и ответственного роста.' },
      uk: { name: 'Loden Legal', description: 'Комерційна юридична експертиза для міжнародних операцій, угод і відповідального зростання.' },
    },
  },
  {
    slug: 'vector-labs',
    category: 'TECHNOLOGY',
    country: 'UKRAINE',
    discountPercent: 25,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&auto=format&fit=crop&q=85',
    sortOrder: 3,
    translations: {
      en: { name: 'Vector Labs', description: 'Digital products and data systems for companies modernizing complex operations.' },
      ru: { name: 'Vector Labs', description: 'Цифровые продукты и системы данных для модернизации сложных бизнес-процессов.' },
      uk: { name: 'Vector Labs', description: 'Цифрові продукти та системи даних для модернізації складних бізнес-процесів.' },
    },
  },
  {
    slug: 'stein-works',
    category: 'ADVISORY',
    country: 'SWITZERLAND',
    discountPercent: 10,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=85',
    sortOrder: 4,
    translations: {
      en: { name: 'Stein Works', description: 'Operational advisory for leadership teams moving from ambition to disciplined execution.' },
      ru: { name: 'Stein Works', description: 'Операционный консалтинг для команд, которые переходят от амбиций к системному исполнению.' },
      uk: { name: 'Stein Works', description: 'Операційний консалтинг для команд, які переходять від амбіцій до системного виконання.' },
    },
  },
  {
    slug: 'vistula-capital',
    category: 'FINANCE',
    country: 'POLAND',
    discountPercent: 15,
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&auto=format&fit=crop&q=85',
    sortOrder: 5,
    translations: {
      en: { name: 'Vistula Capital', description: 'Flexible growth capital and practical financial expertise for established businesses.' },
      ru: { name: 'Vistula Capital', description: 'Гибкий капитал роста и финансовая экспертиза для устойчивых компаний.' },
      uk: { name: 'Vistula Capital', description: 'Гнучкий капітал зростання та фінансова експертиза для сталих компаній.' },
    },
  },
  {
    slug: 'dnipro-digital',
    category: 'TECHNOLOGY',
    country: 'UKRAINE',
    discountPercent: 20,
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&auto=format&fit=crop&q=85',
    sortOrder: 6,
    translations: {
      en: { name: 'Dnipro Digital', description: 'Engineering and transformation support for scalable digital services and platforms.' },
      ru: { name: 'Dnipro Digital', description: 'Инженерная поддержка и трансформация масштабируемых цифровых сервисов.' },
      uk: { name: 'Dnipro Digital', description: 'Інженерна підтримка і трансформація масштабованих цифрових сервісів.' },
    },
  },
  {
    slug: 'rhein-legal',
    category: 'LEGAL',
    country: 'GERMANY',
    discountPercent: 10,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=85',
    sortOrder: 7,
    translations: {
      en: { name: 'Rhein Legal', description: 'Clear commercial counsel for governance, contracts and international market entry.' },
      ru: { name: 'Rhein Legal', description: 'Понятное сопровождение в вопросах управления, контрактов и выхода на новые рынки.' },
      uk: { name: 'Rhein Legal', description: 'Зрозумілий супровід у питаннях управління, контрактів і виходу на нові ринки.' },
    },
  },
  {
    slug: 'alpine-strategy',
    category: 'ADVISORY',
    country: 'SWITZERLAND',
    discountPercent: 5,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop&q=85',
    sortOrder: 8,
    translations: {
      en: { name: 'Alpine Strategy', description: 'Independent strategic perspective for owners considering their next stage of growth.' },
      ru: { name: 'Alpine Strategy', description: 'Независимый стратегический взгляд для владельцев, выбирающих следующий этап роста.' },
      uk: { name: 'Alpine Strategy', description: 'Незалежний стратегічний погляд для власників, які обирають наступний етап зростання.' },
    },
  },
];

async function main() {
  for (const partner of partners) {
    await db.partner.upsert({
      where: { slug: partner.slug },
      update: partner,
      create: partner,
    });
  }

  const count = await db.partner.count();
  console.log(`Seeded ${count} partners.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
