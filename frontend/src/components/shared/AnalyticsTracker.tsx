'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageVisit } from '@/lib/analytics';

/**
 * Tracks page visits on every route change.
 * Include once in the root layout.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageVisit(pathname);
  }, [pathname]);

  return null;
}

export default AnalyticsTracker;
