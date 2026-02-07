export type EventName =
  | 'page_view'
  | 'photo_uploaded'
  | 'photo_processed'
  | 'photo_downloaded'
  | 'photo_removed'
  | 'date_changed'
  | 'language_changed'
  | 'error_occurred'

export interface EventProperties {
  format?: string
  count?: number
  language?: string
  error_message?: string
  error_stack?: string
  [key: string]: unknown
}

export interface AnalyticsProvider {
  init(): void
  track(event: EventName, properties?: EventProperties): void
  trackError(error: Error, context?: Record<string, unknown>): void
}
