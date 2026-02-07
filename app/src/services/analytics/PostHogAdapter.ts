import posthog from 'posthog-js'
import type { AnalyticsProvider, EventName, EventProperties } from './types'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string || 'https://eu.i.posthog.com'

class PostHogAdapter implements AnalyticsProvider {
  private initialized = false

  init(): void {
    if (!POSTHOG_KEY || this.initialized) return
    
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false,
    })
    this.initialized = true
  }

  track(event: EventName, properties?: EventProperties): void {
    if (!this.initialized) return
    posthog.capture(event, properties)
  }

  trackError(error: Error, context?: Record<string, unknown>): void {
    if (!this.initialized) return
    posthog.capture('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    })
  }
}

export const postHogAdapter = new PostHogAdapter()
