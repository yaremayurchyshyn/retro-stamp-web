import { useAppStore } from '../store/useAppStore'
import { PhotoItem } from './PhotoItem'
import styles from './PhotoList.module.css'

export function PhotoList() {
  const photos = useAppStore((s) => s.photos)

  if (photos.length === 0) return null

  return (
    <div className={styles.list}>
      {photos.map((photo) => (
        <PhotoItem key={photo.id} photo={photo} />
      ))}
    </div>
  )
}
