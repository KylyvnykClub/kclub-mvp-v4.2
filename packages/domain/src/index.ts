export type MembershipApplicationStatus = 'APPROVED' | 'REJECTED' | 'SUBMITTED' | 'UNDER_REVIEW';

const allowedTransitions: Readonly<
  Record<MembershipApplicationStatus, readonly MembershipApplicationStatus[]>
> = {
  APPROVED: [],
  REJECTED: [],
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['APPROVED', 'REJECTED'],
};

export const canTransitionMembershipApplication = (
  from: MembershipApplicationStatus,
  to: MembershipApplicationStatus,
): boolean => allowedTransitions[from].includes(to);

export * from './staff-rbac';
