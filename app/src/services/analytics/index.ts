import type { AnalyticsProvider, EventName, EventProperties } from './types'
import { postHogAdapter } from './PostHogAdapter'

class Analytics implements AnalyticsProvider {
  private provider: AnalyticsProvider = postHogAdapter

  init(): void {
    this.provider.init()
  }

  track(event: EventName, properties?: EventProperties): void {
    this.provider.track(event, properties)
  }

  trackError(error: Error, context?: Record<string, unknown>): void {
    this.provider.trackError(error, context)
  }
}

export const analytics = new Analytics()
