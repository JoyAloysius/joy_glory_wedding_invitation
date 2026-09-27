import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { registerServiceWorker } from './utils/registerServiceWorker'

createRoot(document.getElementById('root')!).render(<App />)

registerServiceWorker()
