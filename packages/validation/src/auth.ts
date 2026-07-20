import { z } from 'zod';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;
const NAME_MAX_LENGTH = 120;

export const loginSchema = z.object({
  phone: z.string().min(1, 'auth.errors.phoneRequired'),
  password: z
    .string()
    .min(1, 'auth.errors.passwordRequired'),
});

export const registerSchema = z.object({
  phone: z.string().min(1, 'auth.errors.phoneRequired'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, 'auth.errors.passwordTooShort')
    .max(PASSWORD_MAX_LENGTH, 'auth.errors.passwordTooLong'),
  firstName: z
    .string()
    .trim()
    .min(1, 'auth.errors.firstNameRequired')
    .max(NAME_MAX_LENGTH, 'auth.errors.nameTooLong'),
  lastName: z
    .string()
    .trim()
    .min(1, 'auth.errors.lastNameRequired')
    .max(NAME_MAX_LENGTH, 'auth.errors.nameTooLong'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'auth.errors.passwordRequired'),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, 'auth.errors.passwordTooShort')
      .max(PASSWORD_MAX_LENGTH, 'auth.errors.passwordTooLong'),
    confirmPassword: z.string().min(1, 'auth.errors.confirmPasswordRequired'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'auth.errors.passwordsMismatch',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'auth.errors.firstNameRequired')
    .max(NAME_MAX_LENGTH, 'auth.errors.nameTooLong'),
  lastName: z
    .string()
    .trim()
    .min(1, 'auth.errors.lastNameRequired')
    .max(NAME_MAX_LENGTH, 'auth.errors.nameTooLong'),
  displayName: z.string().trim().max(NAME_MAX_LENGTH).optional(),
  company: z.string().trim().max(NAME_MAX_LENGTH).optional(),
  position: z.string().trim().max(NAME_MAX_LENGTH).optional(),
  bio: z.string().trim().max(500).optional(),
  city: z.string().trim().max(NAME_MAX_LENGTH).optional(),
  country: z.string().trim().max(NAME_MAX_LENGTH).optional(),
});

export const membershipApplicationSchema = z.object({
  motivation: z
    .string()
    .trim()
    .min(10, 'dashboard.membership.errors.motivationTooShort')
    .max(2000, 'dashboard.membership.errors.motivationTooLong'),
  referralSource: z.string().trim().max(200).optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type MembershipApplicationValues = z.infer<typeof membershipApplicationSchema>;

export const authFieldLimits = {
  passwordMin: PASSWORD_MIN_LENGTH,
  passwordMax: PASSWORD_MAX_LENGTH,
  nameMax: NAME_MAX_LENGTH,
} as const;
