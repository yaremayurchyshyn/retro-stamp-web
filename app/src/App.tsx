import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { useLocale } from './store/useLocale'
import { imageProcessor } from './services/imageProcessor'
import { analytics } from './services/analytics'
import { PrivacyBanner } from './components/PrivacyBanner'
import { LoadingScreen } from './components/LoadingScreen'
import { UploadZone } from './components/UploadZone'
import { PhotoList } from './components/PhotoList'
import { ProcessButton } from './components/ProcessButton'
import { DownloadAllButton } from './components/DownloadAllButton'
import { LanguageToggle } from './components/LanguageToggle'
import { Footer } from './components/Footer'
import './index.css'

function App() {
  const isLoading = useAppStore((s) => s.isLoading)
  const loadingPhase = useAppStore((s) => s.loadingPhase)
  const setLoading = useAppStore((s) => s.setLoading)
  const t = useLocale((s) => s.t)

  useEffect(() => {
    analytics.init()
    
    const init = async () => {
      try {
        await imageProcessor.init((phase) => setLoading(true, phase))
        setLoading(false)
      } catch (error) {
        analytics.trackError(error as Error, { context: 'init' })
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
        <div className="header">
          <div>
            <h1>RetroStamp</h1>
            <p className="tagline">{t.tagline}</p>
          </div>
          <LanguageToggle />
        </div>
        
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
