/**
 * UrbanThread AI — Frontend Analytics Tracking
 *
 * Captures user events and sends them to POST /analytics/events.
 * Tracks: page visits, clicks, form submissions, chatbot interactions.
 */

import { ANALYTICS_EVENT_TYPES, type AnalyticsEventType } from '@shared/constants';

interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: string;
  userId?: string | null;
  page: string;
  device: string;
  trafficSource: string | null;
  metadata?: Record<string, unknown>;
}

const API_BASE = '/api/v1';

function getDevice(): string {
  if (typeof window === 'undefined') return 'unknown';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  if (w < 1440) return 'laptop';
  return 'desktop';
}

function getTrafficSource(): string | null {
  if (typeof document === 'undefined') return null;
  return document.referrer || null;
}

function getCurrentPage(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
}

function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('ut-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const state = parsed?.state;
    if (state?.user?.id) return state.user.id;
    if (state?.client?.id) return state.client.id;
  } catch {
    // ignore parse errors
  }
  return null;
}

async function sendEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    // Attach auth token if available
    try {
      const raw = localStorage.getItem('ut-auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        const state = parsed?.state;
        const token = state?.clientToken ?? state?.token;
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore
    }

    await fetch(`${API_BASE}/analytics/events`, {
      method: 'POST',
      headers,
      body: JSON.stringify(event),
      keepalive: true, // ensure event is sent even on page unload
    });
  } catch {
    // Analytics should never break the app — silently fail
  }
}

function buildEvent(
  type: AnalyticsEventType,
  metadata?: Record<string, unknown>,
): AnalyticsEvent {
  return {
    type,
    timestamp: new Date().toISOString(),
    userId: getUserId(),
    page: getCurrentPage(),
    device: getDevice(),
    trafficSource: getTrafficSource(),
    metadata,
  };
}

/**
 * Track a page visit. Call on route changes.
 */
export function trackPageVisit(page?: string): void {
  const event = buildEvent(ANALYTICS_EVENT_TYPES.PAGE_VISIT, {
    visitedPage: page ?? getCurrentPage(),
  });
  if (page) event.page = page;
  sendEvent(event);
}

/**
 * Track a click on a button or interactive element.
 */
export function trackClick(
  elementId: string,
  label?: string,
  metadata?: Record<string, unknown>,
): void {
  sendEvent(
    buildEvent(ANALYTICS_EVENT_TYPES.CLICK, {
      elementId,
      label,
      ...metadata,
    }),
  );
}

/**
 * Track a form submission.
 */
export function trackFormSubmit(
  formName: string,
  success: boolean,
  metadata?: Record<string, unknown>,
): void {
  sendEvent(
    buildEvent(ANALYTICS_EVENT_TYPES.FORM_SUBMIT, {
      formName,
      success,
      ...metadata,
    }),
  );
}

/**
 * Track a chatbot interaction.
 */
export function trackChatbotInteraction(
  action: 'open' | 'close' | 'send_message' | 'escalate' | 'clear',
  metadata?: Record<string, unknown>,
): void {
  sendEvent(
    buildEvent(ANALYTICS_EVENT_TYPES.CHATBOT_INTERACTION, {
      action,
      ...metadata,
    }),
  );
}

/**
 * Track a login event.
 */
export function trackLogin(
  method: 'admin' | 'otp',
  success: boolean,
): void {
  sendEvent(
    buildEvent(ANALYTICS_EVENT_TYPES.LOGIN, {
      method,
      success,
    }),
  );
}
