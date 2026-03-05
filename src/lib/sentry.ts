// Error tracking utility - ready for Sentry integration
// Install: npm install @sentry/nextjs
// Then wrap your app with Sentry in layout.tsx

interface ErrorContext {
  [key: string]: unknown;
}

interface ErrorTracker {
  captureException: (error: Error, context?: ErrorContext) => void;
  captureMessage: (message: string, context?: ErrorContext) => void;
  setUser: (user: { id: string; email: string } | null) => void;
}

// Check if Sentry is configured
const isSentryConfigured = !!process.env.NEXT_PUBLIC_SENTRY_DSN;

// Lazy load Sentry only when needed - uses dynamic require to avoid build errors
let sentryModule: any = null;

async function getSentryModule() {
  if (!sentryModule && isSentryConfigured) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      sentryModule = require("@sentry/nextjs");
    } catch (error) {
      console.warn("Sentry not installed. Run: npm install @sentry/nextjs");
    }
  }
  return sentryModule;
}



// Production error tracker - uses Sentry if configured, falls back to console
const errorTracker: ErrorTracker = {
  async captureException(error: Error, context?: ErrorContext) {
    const sentry = await getSentryModule();
    if (sentry) {
      sentry.captureException(error, { extra: context });
    } else {
      // Fallback to console in development
      console.error("Error captured:", error.message, context);
    }
  },

  async captureMessage(message: string, context?: ErrorContext) {
    const sentry = await getSentryModule();
    if (sentry) {
      sentry.captureMessage(message, { extra: context });
    } else {
      console.warn("Message captured:", message, context);
    }
  },

  async setUser(user: { id: string; email: string } | null) {
    const sentry = await getSentryModule();
    if (sentry) {
      sentry.setUser(user);
    }
  },
};


export const captureException = errorTracker.captureException;
export const captureMessage = errorTracker.captureMessage;
export const setUser = errorTracker.setUser;

// For use in API routes
export async function withErrorTracking<T>(
  fn: () => Promise<T>,
  context?: ErrorContext
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    await captureException(error instanceof Error ? error : new Error(String(error)), context);
    throw error;
  }
}

// For use in React components - wrap your error.tsx with this
export function getErrorBoundaryProps(error: Error & { digest?: string }) {
  return {
    error,
    digest: error.digest,
  };
}
