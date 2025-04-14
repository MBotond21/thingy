import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { MusicContextProvider } from './contexts/MusicContext.tsx'
import { ApiProvider } from './contexts/ApiContext.tsx'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <ApiProvider>
        <MusicContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MusicContextProvider>
      </ApiProvider>
    </DndProvider>
  </StrictMode>,
)
