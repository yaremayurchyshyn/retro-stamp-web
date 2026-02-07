import { create } from 'zustand'

export interface PhotoItem {
  id: string
  file: File
  status: 'pending' | 'processing' | 'done' | 'error'
  result?: string
  error?: string
  dateStr?: string
}

interface AppState {
  photos: PhotoItem[]
  isLoading: boolean
  loadingPhase: string
  processingIndex: number

  addPhotos: (files: File[]) => void
  removePhoto: (id: string) => void
  setLoading: (isLoading: boolean, phase?: string) => void
  setPhotoDate: (id: string, dateStr: string) => void
  setPhotoStatus: (id: string, status: PhotoItem['status'], result?: string, error?: string) => void
  setProcessingIndex: (index: number) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  photos: [],
  isLoading: true,
  loadingPhase: 'Initializing...',
  processingIndex: -1,

  addPhotos: (files) => set((state) => ({
    photos: [
      ...state.photos,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: 'pending' as const,
      })),
    ],
  })),

  removePhoto: (id) => set((state) => ({
    photos: state.photos.filter((p) => p.id !== id),
  })),

  setLoading: (isLoading, phase) => set({
    isLoading,
    loadingPhase: phase ?? '',
  }),

  setPhotoDate: (id, dateStr) => set((state) => ({
    photos: state.photos.map((p) =>
      p.id === id ? { ...p, dateStr } : p
    ),
  })),

  setPhotoStatus: (id, status, result, error) => set((state) => ({
    photos: state.photos.map((p) =>
      p.id === id ? { ...p, status, result, error } : p
    ),
  })),

  setProcessingIndex: (index) => set({ processingIndex: index }),

  reset: () => set({
    photos: [],
    processingIndex: -1,
  }),
}))
