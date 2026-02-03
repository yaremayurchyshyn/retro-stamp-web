import { useAppStore } from '../store/useAppStore'
import styles from './DownloadAllButton.module.css'

const DOWNLOAD_DELAY_MS = 100

export function DownloadAllButton() {
  const photos = useAppStore((s) => s.photos)
  const donePhotos = photos.filter((p) => p.status === 'done' && p.result)

  const handleDownloadAll = async () => {
    for (const photo of donePhotos) {
      if (!photo.result) continue
      
      const link = document.createElement('a')
      link.href = `data:image/jpeg;base64,${photo.result}`
      link.download = `stamped_${photo.file.name.replace(/\.[^.]+$/, '')}.jpg`
      link.click()
      
      await new Promise((r) => setTimeout(r, DOWNLOAD_DELAY_MS))
    }
  }

  if (donePhotos.length === 0) return null

  return (
    <button onClick={handleDownloadAll} className={styles.button}>
      Download All ({donePhotos.length})
    </button>
  )
}
