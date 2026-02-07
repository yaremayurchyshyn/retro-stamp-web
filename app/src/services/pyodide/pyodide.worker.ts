import { PYODIDE_URL } from '../constants'
import { PYTHON_CODE } from './pythonCode'

interface PyodideInterface {
  loadPackage: (name: string) => Promise<void>
  runPythonAsync: (code: string) => Promise<string>
  globals: {
    set: (name: string, value: unknown) => void
  }
}

let pyodide: PyodideInterface | null = null

async function init(): Promise<void> {
  const pyodideModule = await import(/* @vite-ignore */ PYODIDE_URL) as {
    loadPyodide: () => Promise<PyodideInterface>
  }
  pyodide = await pyodideModule.loadPyodide()
  await pyodide.loadPackage('pillow')
  await pyodide.runPythonAsync(PYTHON_CODE)
  self.postMessage({ type: 'ready' })
}

self.onmessage = async (e: MessageEvent) => {
  const { type, id, code, globals } = e.data

  if (type === 'init') {
    try {
      await init()
    } catch (error) {
      self.postMessage({ type: 'error', id, error: (error as Error).message })
    }
    return
  }

  if (type === 'run') {
    if (!pyodide) {
      self.postMessage({ type: 'error', id, error: 'Pyodide not initialized' })
      return
    }

    try {
      // Set globals
      for (const [name, value] of Object.entries(globals || {})) {
        pyodide.globals.set(name, value)
      }

      // Run code
      const result = await pyodide.runPythonAsync(code)

      // Clear globals
      await pyodide.runPythonAsync(`
rgba_data = None
input_data = None
img_width = None
img_height = None
date_str = None
orientation = None
import gc
gc.collect()
`)

      self.postMessage({ type: 'result', id, result })
    } catch (error) {
      self.postMessage({ type: 'error', id, error: (error as Error).message })
    }
  }
}
