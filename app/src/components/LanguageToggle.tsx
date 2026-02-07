import { useLocale } from '../store/useLocale'
import { analytics } from '../services/analytics'
import styles from './LanguageToggle.module.css'

export function LanguageToggle() {
  const { locale, setLocale } = useLocale()

  const handleChange = (newLocale: 'en' | 'uk') => {
    setLocale(newLocale)
    analytics.track('language_changed', { language: newLocale })
  }

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value as 'en' | 'uk')}
      className={styles.select}
    >
      <option value="en">EN</option>
      <option value="uk">UA</option>
    </select>
  )
}
