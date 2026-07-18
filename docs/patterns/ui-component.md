# Shared UI Component Pattern

```tsx
type ButtonProps = {
  tone?: 'primary' | 'neutral' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
} & React.ComponentPropsWithoutRef<'button'>;

export const Button = ({
  tone = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={buttonVariants({ tone, size })}
    data-loading={loading || undefined}
    disabled={disabled || loading}
  >
    {children}
  </button>
);
```

A primitive exposes semantic variants and native accessibility behavior. It does not know what operation it triggers, who may trigger it, or how data is saved. Consumer code passes translated labels and callbacks.
