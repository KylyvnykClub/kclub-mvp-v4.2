import type { PrismaClient } from '@kclub/database';

type IssueClubCardInput = {
  memberId: string;
  issuedAt?: Date;
};

const addYears = (date: Date, years: number) => {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
};

const formatCardNumber = (sequence: number) => `MEM-${String(sequence).padStart(6, '0')}`;

const formatPublicId = (memberId: string, attempt: number) => {
  const compactId = memberId.replaceAll('-', '').toUpperCase();
  return attempt === 0 ? compactId.slice(0, 8) : `${compactId.slice(0, 6)}${attempt + 1}`;
};

export const ensureActiveClubCard =
  (db: PrismaClient) =>
  async ({ memberId, issuedAt = new Date() }: IssueClubCardInput) => {
    const activeCard = await db.clubCard.findFirst({
      where: { memberId, status: 'ACTIVE' },
      orderBy: { issuedAt: 'desc' },
    });

    if (activeCard) {
      return activeCard;
    }

    const existingCount = await db.clubCard.count();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        return await db.clubCard.create({
          data: {
            memberId,
            cardNumber: formatCardNumber(existingCount + attempt + 1),
            publicId: formatPublicId(memberId, attempt),
            tier: 'MEMBER',
            status: 'ACTIVE',
            issuedAt,
            expiresAt: addYears(issuedAt, 1),
          },
        });
      } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          error.code === 'P2002'
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new Error('Unable to issue a unique club card.');
  };
