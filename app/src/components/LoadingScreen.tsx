import styles from './LoadingScreen.module.css'

interface LoadingScreenProps {
  phase: string
  visible: boolean
}

export function LoadingScreen({ phase, visible }: LoadingScreenProps) {
  if (!visible) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
      <p className={styles.phase}>{phase}</p>
    </div>
  )
}
