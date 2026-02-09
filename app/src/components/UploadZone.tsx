import { useState, useRef } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useLocale } from '../store/useLocale'
import { analytics } from '../services/analytics'
import { SUPPORTED_FORMATS } from '../constants'
import styles from './UploadZone.module.css'

export function UploadZone() {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addPhotos = useAppStore((s) => s.addPhotos)
  const t = useLocale((s) => s.t)

  const filterValidFiles = (files: FileList | null): File[] => {
    if (!files) return []
    return Array.from(files).filter((file) => SUPPORTED_FORMATS.pattern.test(file.name))
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const trackUpload = (files: File[]) => {
    files.forEach((file) => {
      const format = file.name.split('.').pop()?.toLowerCase()
      analytics.track('photo_uploaded', { format })
    })
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const validFiles = filterValidFiles(e.dataTransfer.files)
    if (validFiles.length) {
      addPhotos(validFiles)
      trackUpload(validFiles)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const validFiles = filterValidFiles(e.target.files)
    if (validFiles.length) {
      addPhotos(validFiles)
      trackUpload(validFiles)
    }
    e.target.value = ''
  }

  const openFilePicker = () => inputRef.current?.click()

  return (
    <div
      className={`${styles.zone} ${isDragOver ? styles.dragOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFilePicker}
    >
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_FORMATS.accept}
        multiple
        onChange={handleFileSelect}
        className={styles.hiddenInput}
      />
      <div className={styles.icon}>📷</div>
      <p className={styles.text}>{t.uploadZone}</p>
      <p className={styles.hint}>{t.uploadHint}</p>
    </div>
  )
}
