import { useAppStore } from '../store/useAppStore'
import { imageProcessor } from '../services/imageProcessor'
import styles from './ProcessButton.module.css'

export function ProcessButton() {
  const photos = useAppStore((s) => s.photos)
  const processingIndex = useAppStore((s) => s.processingIndex)
  const setPhotoStatus = useAppStore((s) => s.setPhotoStatus)
  const setProcessingIndex = useAppStore((s) => s.setProcessingIndex)

  const pendingPhotos = photos.filter((p) => p.status === 'pending')
  const isProcessing = processingIndex >= 0
  const isDisabled = pendingPhotos.length === 0 || isProcessing

  const handleProcess = async () => {
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      if (photo.status !== 'pending') continue

      setProcessingIndex(i)
      setPhotoStatus(photo.id, 'processing')

      try {
        const result = await imageProcessor.processImage(photo.file, photo.dateStr)
        setPhotoStatus(photo.id, 'done', result)
      } catch {
        setPhotoStatus(photo.id, 'error', undefined, 'Processing failed. Please try again.')
      }
    }
    setProcessingIndex(-1)
  }

  const getButtonText = (): string => {
    if (!isProcessing) return `Stamp All (${pendingPhotos.length})`
    const doneCount = photos.filter((p) => p.status === 'done').length
    return `Stamping ${doneCount + 1}/${photos.length}...`
  }

  if (photos.length === 0) return null

  return (
    <button 
      onClick={handleProcess} 
      disabled={isDisabled}
      className={styles.button}
    >
      {getButtonText()}
    </button>
  )
}
