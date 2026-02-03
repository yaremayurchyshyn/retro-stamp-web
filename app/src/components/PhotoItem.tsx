import { useEffect, useState } from 'react'
import type { PhotoItem as PhotoItemType } from '../store/useAppStore'
import { imageProcessor } from '../services/imageProcessor'
import styles from './PhotoItem.module.css'

interface PhotoItemProps {
  photo: PhotoItemType
}

const STATUS_LABELS = {
  pending: 'Waiting...',
  processing: '⏳ Processing...',
  done: '✅ Done',
  error: '❌ Error',
} as const

export function PhotoItem({ photo }: PhotoItemProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('')

  useEffect(() => {
    let revoke: (() => void) | null = null

    const loadThumbnail = async () => {
      const isHeic = /\.(heic|heif)$/i.test(photo.file.name)
      
      if (isHeic) {
        try {
          const base64 = await imageProcessor.decodeHeicToBase64(photo.file)
          setThumbnailUrl(`data:image/jpeg;base64,${base64}`)
        } catch {
          setThumbnailUrl('')
        }
      } else {
        const url = URL.createObjectURL(photo.file)
        setThumbnailUrl(url)
        revoke = () => URL.revokeObjectURL(url)
      }
    }

    loadThumbnail()
    return () => revoke?.()
  }, [photo.file])

  const getImageSrc = (): string => {
    if (photo.status === 'done' && photo.result) {
      return `data:image/jpeg;base64,${photo.result}`
    }
    return thumbnailUrl
  }

  const getStatusLabel = (): string => {
    if (photo.status === 'error' && photo.error) {
      return `❌ ${photo.error}`
    }
    return STATUS_LABELS[photo.status]
  }

  const getDownloadFilename = (): string => {
    return `stamped_${photo.file.name.replace(/\.[^.]+$/, '')}.jpg`
  }

  const handleDownload = () => {
    if (!photo.result) return
    
    // Convert base64 to blob for iOS compatibility
    const byteCharacters = atob(photo.result)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/jpeg' })
    const blobUrl = URL.createObjectURL(blob)
    
    // Create link and click
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = getDownloadFilename()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Cleanup after delay
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
  }

  return (
    <div className={styles.item}>
      <img src={getImageSrc()} alt={photo.file.name} className={styles.thumbnail} />
      
      <div className={styles.info}>
        <p className={styles.filename}>{photo.file.name}</p>
        <p className={styles.status}>{getStatusLabel()}</p>
      </div>

      {photo.status === 'done' && photo.result && (
        <button onClick={handleDownload} className={styles.downloadBtn}>
          Download
        </button>
      )}
    </div>
  )
}
