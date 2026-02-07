import { useLocale } from '../store/useLocale'
import styles from './LanguageToggle.module.css'

export function LanguageToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as 'en' | 'uk')}
      className={styles.select}
    >
      <option value="en">EN</option>
      <option value="uk">UA</option>
    </select>
  )
}
