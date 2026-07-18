import { z } from 'zod';

/**
 * Public contact form submitted from the marketing home page.
 *
 * Boundary-only schema: validates untrusted input at the edge. It does NOT
 * define a persistence contract — there is currently no product-core route,
 * service command, or Prisma model that stores a contact submission. The
 * backing feature slice (contracts + database + command + audit) is tracked
 * separately. Until it exists, this schema is used only for client-side
 * validation of the public contact form.
 */
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 2000;
const NAME_MAX_LENGTH = 120;
const COMPANY_MAX_LENGTH = 120;
const PHONE_MAX_LENGTH = 40;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'contact.form.errors.nameRequired')
    .max(NAME_MAX_LENGTH, 'contact.form.errors.nameTooLong'),
  email: z.email('contact.form.errors.emailInvalid'),
  company: z
    .string()
    .trim()
    .max(COMPANY_MAX_LENGTH, 'contact.form.errors.companyTooLong')
    .optional(),
  phone: z
    .string()
    .trim()
    .max(PHONE_MAX_LENGTH, 'contact.form.errors.phoneTooLong')
    .optional(),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN_LENGTH, 'contact.form.errors.messageTooShort')
    .max(MESSAGE_MAX_LENGTH, 'contact.form.errors.messageTooLong'),
  // Honeypot: must stay empty. Bots fill it; humans never see it.
  companyUrl: z.string().max(0).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const contactFieldLimits = {
  messageMin: MESSAGE_MIN_LENGTH,
  messageMax: MESSAGE_MAX_LENGTH,
  nameMax: NAME_MAX_LENGTH,
  companyMax: COMPANY_MAX_LENGTH,
  phoneMax: PHONE_MAX_LENGTH,
} as const;
