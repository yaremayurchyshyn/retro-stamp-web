import { APP_VERSION } from '../version'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>v{APP_VERSION}</span>
      <a href="https://github.com/yaremayurchyshyn/retro-stamp-web" target="_blank" rel="noopener">
        GitHub
      </a>
    </footer>
  )
}
