import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import StarknetProvider from './providers/StarknetProvider.tsx'
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback="loading">
      <StarknetProvider>
        <App />
      </StarknetProvider>
    </Suspense>
  </StrictMode>,
)