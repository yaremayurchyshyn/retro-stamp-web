import { useLocale } from '../store/useLocale'
import styles from './PrivacyBanner.module.css'

export function PrivacyBanner() {
  const t = useLocale((s) => s.t)
  return (
    <div className={styles.banner}>
      {t.privacyBanner}
    </div>
  )
}
