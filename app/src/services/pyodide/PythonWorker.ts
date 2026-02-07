const WORKER_TIMEOUT_MS = 60000

interface PendingRequest {
  resolve: (result: string) => void
  reject: (error: Error) => void
}

class PythonWorker {
  private worker: Worker | null = null
  private ready = false
  private pendingRequests = new Map<number, PendingRequest>()
  private requestId = 0
  private initPromise: Promise<void> | null = null

  async init(onProgress: (phase: string) => void): Promise<void> {
    if (this.initPromise) return this.initPromise

    this.initPromise = new Promise((resolve, reject) => {
      onProgress('Loading Python runtime...')
      
      const worker = new Worker(
        new URL('./pyodide.worker.ts', import.meta.url),
        { type: 'module' }
      )
      this.worker = worker

      const timeout = setTimeout(() => {
        reject(new Error('Worker init timeout'))
      }, WORKER_TIMEOUT_MS)

      worker.onmessage = (e: MessageEvent) => {
        const { type, id, result, error } = e.data

        if (type === 'ready') {
          clearTimeout(timeout)
          this.ready = true
          onProgress('Python runtime ready')
          resolve()
          return
        }

        const pending = this.pendingRequests.get(id)
        if (!pending) return

        this.pendingRequests.delete(id)
        if (type === 'result') {
          pending.resolve(result)
        } else if (type === 'error') {
          pending.reject(new Error(error))
        }
      }

      worker.onerror = (e) => {
        clearTimeout(timeout)
        reject(new Error(e.message))
      }

      worker.postMessage({ type: 'init' })
    })

    return this.initPromise
  }

  isReady(): boolean {
    return this.ready
  }

  async run(code: string, globals?: Record<string, unknown>): Promise<string> {
    const worker = this.worker
    if (!worker || !this.ready) {
      throw new Error('Worker not initialized')
    }

    return new Promise((resolve, reject) => {
      const id = ++this.requestId
      
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id)
        reject(new Error('Operation timeout'))
      }, WORKER_TIMEOUT_MS)
      
      this.pendingRequests.set(id, {
        resolve: (result) => {
          clearTimeout(timeout)
          resolve(result)
        },
        reject: (error) => {
          clearTimeout(timeout)
          reject(error)
        },
      })
      
      worker.postMessage({ type: 'run', id, code, globals })
    })
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
      this.ready = false
      this.initPromise = null
      
      for (const [, pending] of this.pendingRequests) {
        pending.reject(new Error('Worker terminated'))
      }
      this.pendingRequests.clear()
    }
  }

  async restart(onProgress: (phase: string) => void): Promise<void> {
    this.terminate()
    await this.init(onProgress)
  }
}

export const pythonWorker = new PythonWorker()
