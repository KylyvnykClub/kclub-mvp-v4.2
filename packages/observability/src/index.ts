export type ErrorSeverity = 'fatal' | 'error' | 'warning';

export type ErrorContext = Readonly<{
  scope: string;
  requestId?: string;
  userId?: string;
  extra?: Record<string, unknown>;
}>;

declare const globalThis: {
  Sentry?: {
    captureException: (
      error: unknown,
      options?: { level?: ErrorSeverity; tags?: Record<string, string>; extra?: Record<string, unknown> },
    ) => void;
  };
};

function reportToSentry(error: unknown, context: ErrorContext, severity: ErrorSeverity): void {
  const sentry = globalThis.Sentry;
  if (sentry === undefined) return;
  sentry.captureException(error, {
    level: severity,
    tags: { scope: context.scope },
    ...(context.extra !== undefined ? { extra: context.extra } : {}),
  });
}

export const logError = (
  error: unknown,
  context: ErrorContext,
  severity: ErrorSeverity = 'error',
): void => {
  const normalized =
    error instanceof Error
      ? { message: error.message, stack: error.stack, name: error.name }
      : { message: String(error) };

  console.error(
    JSON.stringify({
      severity,
      ...context,
      ...normalized,
      timestamp: new Date().toISOString(),
    }),
  );

  reportToSentry(error, context, severity);
};
