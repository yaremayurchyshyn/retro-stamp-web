import { useState, useEffect } from 'react'
import { APP_VERSION } from '../version'
import styles from './Footer.module.css'

export function Footer() {
  const [debug, setDebug] = useState('')

  useEffect(() => {
    const id = setInterval(() => {
      const val = (window as unknown as Record<string, string>).__heicDebug
      if (val) setDebug(val)
    }, 500)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className={styles.footer}>
      <span>v{APP_VERSION} {debug}</span>
      <a href="https://github.com/yaremayurchyshyn/retro-stamp-web" target="_blank" rel="noopener">
        GitHub
      </a>
    </footer>
  )
}
