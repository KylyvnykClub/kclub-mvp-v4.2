import { describe, expect, it } from 'vitest';

import {
  contactFieldLimits,
  contactFormSchema,
  type ContactFormValues,
} from '../src/index';

const validBase = {
  name: 'Olena Kovalenko',
  email: 'olena@example.com',
  message: 'I would like to learn more about membership criteria.',
} satisfies ContactFormValues;

describe('contactFormSchema', () => {
  it('accepts a valid minimal submission', () => {
    const result = contactFormSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('accepts a valid submission with optional fields', () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      company: 'Koval Studio',
      phone: '+380 44 123 4567',
    });
    expect(result.success).toBe(true);
  });

  it('trims surrounding whitespace from text fields', () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      name: '  Olena Kovalenko  ',
      message: '  I would like to learn more about membership criteria.  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Olena Kovalenko');
      expect(result.data.message).toBe(
        'I would like to learn more about membership criteria.',
      );
    }
  });

  it('rejects an empty name', () => {
    const result = contactFormSchema.safeParse({ ...validBase, name: '   ' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a message shorter than the minimum length', () => {
    const result = contactFormSchema.safeParse({ ...validBase, message: 'too short' });
    expect(result.success).toBe(false);
  });

  it('rejects a message longer than the maximum length', () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      message: 'x'.repeat(contactFieldLimits.messageMax + 1),
    });
    expect(result.success).toBe(false);
  });

  it('rejects a name longer than the maximum length', () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      name: 'x'.repeat(contactFieldLimits.nameMax + 1),
    });
    expect(result.success).toBe(false);
  });

  it('rejects a company longer than the maximum length', () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      company: 'x'.repeat(contactFieldLimits.companyMax + 1),
    });
    expect(result.success).toBe(false);
  });

  it('rejects a phone longer than the maximum length', () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      phone: '1'.repeat(contactFieldLimits.phoneMax + 1),
    });
    expect(result.success).toBe(false);
  });

  it('rejects a filled honeypot field', () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      companyUrl: 'https://spam.example',
    });
    expect(result.success).toBe(false);
  });

  it('accepts an empty honeypot field', () => {
    const result = contactFormSchema.safeParse({ ...validBase, companyUrl: '' });
    expect(result.success).toBe(true);
  });

  it('returns localized error message keys on failure', () => {
    const result = contactFormSchema.safeParse({
      ...validBase,
      email: 'bad',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const codes = result.error.issues.map((issue) => issue.message);
      expect(codes).toContain('contact.form.errors.emailInvalid');
    }
  });
});
