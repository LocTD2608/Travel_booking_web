import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1BA0E2',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            },
          }}
        >
          <App />
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
