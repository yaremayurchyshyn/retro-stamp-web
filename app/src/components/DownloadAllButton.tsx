import { useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import styles from './DownloadAllButton.module.css'

const DOWNLOAD_DELAY_MS = 150

export function DownloadAllButton() {
  const photos = useAppStore((s) => s.photos)
  const linksRef = useRef<HTMLDivElement>(null)
  const donePhotos = photos.filter((p) => p.status === 'done' && p.result)

  const handleDownloadAll = async () => {
    if (!linksRef.current) return
    
    const links = linksRef.current.querySelectorAll('a')
    for (const link of links) {
      link.click()
      await new Promise((r) => setTimeout(r, DOWNLOAD_DELAY_MS))
    }
  }

  if (donePhotos.length === 0) return null

  return (
    <div className={styles.container}>
      <button onClick={handleDownloadAll} className={styles.button}>
        Download All ({donePhotos.length})
      </button>
      <div ref={linksRef} className={styles.hiddenLinks}>
        {donePhotos.map((photo) => (
          <a
            key={photo.id}
            href={`data:image/jpeg;base64,${photo.result}`}
            download={`stamped_${photo.file.name.replace(/\.[^.]+$/, '')}.jpg`}
          >
            {photo.file.name}
          </a>
        ))}
      </div>
    </div>
  )
}
