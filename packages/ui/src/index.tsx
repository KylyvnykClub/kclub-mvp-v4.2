import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

type ButtonProps = Readonly<
  ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'primary' | 'neutral' | 'ghost' }
>;
export const Button = ({ className, tone = 'primary', type = 'button', ...props }: ButtonProps) => (
  <button
    className={['kc-button kc-focus-ring', className].filter(Boolean).join(' ')}
    data-tone={tone === 'primary' ? undefined : tone}
    type={type}
    {...props}
  />
);

type InputProps = Readonly<InputHTMLAttributes<HTMLInputElement>>;
export const Input = ({ className, ...props }: InputProps) => (
  <input className={['kc-input', className].filter(Boolean).join(' ')} {...props} />
);

type FieldProps = Readonly<{
  children: ReactNode;
  error?: string;
  hint?: string;
  label: string;
  name: string;
}>;
export const Field = ({ children, error, hint, label, name }: FieldProps) => (
  <div className="kc-field">
    <label className="kc-label" htmlFor={name}>
      {label}
    </label>
    {children}
    {hint === undefined ? null : <p className="kc-form-hint">{hint}</p>}
    {error === undefined ? null : (
      <p className="kc-field-error" role="alert">
        {error}
      </p>
    )}
  </div>
);

type DataStateProps = Readonly<{
  children?: ReactNode;
  message: string;
  title: string;
  tone?: 'error' | 'neutral' | 'success';
}>;
export const DataState = ({ children, message, title, tone = 'neutral' }: DataStateProps) => (
  <section className="kc-data-state" data-tone={tone} aria-live="polite">
    <h2>{title}</h2>
    <p>{message}</p>
    {children}
  </section>
);
