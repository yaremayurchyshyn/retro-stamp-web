import { PYODIDE_URL } from '../constants'
import { PYTHON_CODE } from './pythonCode'

interface PyodideInterface {
  loadPackage: (name: string) => Promise<void>
  runPythonAsync: (code: string) => Promise<string>
  globals: {
    set: (name: string, value: unknown) => void
  }
}

class PythonRunner {
  private pyodide: PyodideInterface | null = null
  private ready = false

  async init(onProgress: (phase: string) => void): Promise<void> {
    onProgress('Loading Python runtime...')
    // Dynamic import via Function() required for CDN ESM modules
    const pyodideModule = await Function(`return import("${PYODIDE_URL}")`)() as { 
      loadPyodide: () => Promise<PyodideInterface> 
    }
    this.pyodide = await pyodideModule.loadPyodide()

    if (!this.pyodide) throw new Error('Failed to load Pyodide')

    onProgress('Loading image library...')
    await this.pyodide.loadPackage('pillow')

    onProgress('Preparing processor...')
    await this.pyodide.runPythonAsync(PYTHON_CODE)
    this.ready = true
  }

  isReady(): boolean {
    return this.ready
  }

  setGlobal(name: string, value: unknown): void {
    this.pyodide?.globals.set(name, value)
  }

  async clearGlobals(): Promise<void> {
    if (!this.pyodide) return
    await this.pyodide.runPythonAsync(`
rgba_data = None
input_data = None
img_width = None
img_height = None
date_str = None
orientation = None
import gc
gc.collect()
`)
  }

  async run(code: string): Promise<string> {
    if (!this.pyodide) throw new Error('Pyodide not initialized')
    return this.pyodide.runPythonAsync(code)
  }
}

export const pythonRunner = new PythonRunner()
