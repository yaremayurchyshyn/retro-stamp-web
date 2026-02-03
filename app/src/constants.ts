export const COLORS = {
  primary: '#FFA032',
  primaryLight: '#fff8f0',
  success: '#2e7d32',
  successBg: '#e8f5e9',
  error: '#d32f2f',
  text: '#213547',
  textMuted: '#666',
  textLight: '#999',
  border: '#eee',
  borderDark: '#ccc',
  background: '#fafafa',
  white: '#fff',
  overlay: 'rgba(255,255,255,0.95)',
} as const

export const SIZES = {
  thumbnailSize: 60,
  borderRadius: 8,
  borderRadiusSmall: 4,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 40,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 32,
  },
} as const

export const SUPPORTED_FORMATS = {
  accept: 'image/jpeg,image/png,image/heic,image/heif,image/webp,.heic,.HEIC',
  pattern: /\.(jpe?g|png|heic|heif|webp)$/i,
  label: 'JPEG, PNG, HEIC, WEBP',
} as const
