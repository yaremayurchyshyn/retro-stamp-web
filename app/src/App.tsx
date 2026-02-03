import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { imageProcessor } from './services/imageProcessor'
import { PrivacyBanner } from './components/PrivacyBanner'
import { LoadingScreen } from './components/LoadingScreen'
import { UploadZone } from './components/UploadZone'
import { PhotoList } from './components/PhotoList'
import { ProcessButton } from './components/ProcessButton'
import { DownloadAllButton } from './components/DownloadAllButton'
import { Footer } from './components/Footer'
import './index.css'

function App() {
  const isLoading = useAppStore((s) => s.isLoading)
  const loadingPhase = useAppStore((s) => s.loadingPhase)
  const setLoading = useAppStore((s) => s.setLoading)

  useEffect(() => {
    const init = async () => {
      try {
        await imageProcessor.init((phase) => setLoading(true, phase))
        setLoading(false)
      } catch {
        setLoading(false, 'Failed to load. Please refresh.')
      }
    }
    init()
  }, [setLoading])

  return (
    <>
      <PrivacyBanner />
      <LoadingScreen phase={loadingPhase} visible={isLoading} />
      
      <main className="container">
        <h1>RetroStamp</h1>
        <p className="tagline">Date your memories</p>
        
        <UploadZone />
        
        <div className="actions">
          <ProcessButton />
          <DownloadAllButton />
        </div>
        
        <PhotoList />
      </main>
      
      <Footer />
    </>
  )
}

export default App
