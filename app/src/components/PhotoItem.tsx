import { useEffect, useState } from 'react'
import type { PhotoItem as PhotoItemType } from '../store/useAppStore'
import { useAppStore } from '../store/useAppStore'
import { useLocale } from '../store/useLocale'
import { imageProcessor } from '../services/imageProcessor'
import styles from './PhotoItem.module.css'

interface PhotoItemProps {
  photo: PhotoItemType
}

export function PhotoItem({ photo }: PhotoItemProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const setPhotoDate = useAppStore((s) => s.setPhotoDate)
  const setPhotoStatus = useAppStore((s) => s.setPhotoStatus)
  const t = useLocale((s) => s.t)

  useEffect(() => {
    let revoke: (() => void) | null = null

    const loadThumbnailAndDate = async () => {
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

      const dateStr = await imageProcessor.extractDate(photo.file)
      setPhotoDate(photo.id, dateStr)

      setIsLoading(false)
    }

    loadThumbnailAndDate()
    return () => revoke?.()
  }, [photo.file, photo.id, setPhotoDate])

  const getImageSrc = (): string => {
    if (photo.status === 'done' && photo.result) {
      return `data:image/jpeg;base64,${photo.result}`
    }
    return thumbnailUrl
  }

  const getStatusLabel = (): string => {
    if (isLoading) return t.loading
    if (photo.status === 'error' && photo.error) {
      return `${t.error}: ${photo.error}`
    }
    const labels = {
      pending: t.readyToProcess,
      processing: t.processing,
      done: t.done,
      error: t.error,
    }
    return labels[photo.status]
  }

  const getDownloadFilename = (): string => {
    return `stamped_${photo.file.name.replace(/\.[^.]+$/, '')}.jpg`
  }

  const handleDownload = () => {
    if (!photo.result) return
    
    const byteCharacters = atob(photo.result)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/jpeg' })
    const blobUrl = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = getDownloadFilename()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      const newDateStr = `${day}.${month}.${year}`
      setPhotoDate(photo.id, newDateStr)
      if (photo.status === 'done' || photo.status === 'error') {
        setPhotoStatus(photo.id, 'pending')
      }
    }
  }

  const getInputDateValue = (): string => {
    if (!photo.dateStr) return ''
    const [day, month, year] = photo.dateStr.split('.')
    return `${year}-${month}-${day}`
  }

  return (
    <>
      <div className={styles.item}>
        <div className={styles.thumbnailWrapper}>
          {isLoading ? (
            <div className={styles.thumbnailPlaceholder}>⏳</div>
          ) : (
            <img
              src={getImageSrc()}
              alt={photo.file.name}
              className={styles.thumbnail}
              onClick={() => setShowPreview(true)}
            />
          )}
        </div>
        
        <div className={styles.info}>
          <p className={styles.filename}>{photo.file.name}</p>
          {!isLoading && (
            <div className={styles.dateRow}>
              <span>📅</span>
              <input
                type="date"
                value={getInputDateValue()}
                onChange={handleDateChange}
                className={styles.dateInput}
                disabled={photo.status === 'processing'}
              />
            </div>
          )}
          <p className={styles.status}>{getStatusLabel()}</p>
        </div>

        {photo.status === 'done' && photo.result && (
          <button onClick={handleDownload} className={styles.downloadBtn}>
            {t.download}
          </button>
        )}
      </div>

      {showPreview && (
        <div className={styles.overlay} onClick={() => setShowPreview(false)}>
          <img src={getImageSrc()} alt={photo.file.name} className={styles.previewImage} />
        </div>
      )}
    </>
  )
}
