import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'

// Đè ghi đè localStorage cho các key auth sang sessionStorage để cách ly session giữa các tab
const originalGetItem = localStorage.getItem.bind(localStorage);
const originalSetItem = localStorage.setItem.bind(localStorage);
const originalRemoveItem = localStorage.removeItem.bind(localStorage);

const sessionIsolatedKeys = ['token', 'user', 'authority', 'adminToken', 'antd-pro-authority'];

localStorage.getItem = function(key) {
    if (sessionIsolatedKeys.includes(key)) {
        return sessionStorage.getItem(key);
    }
    return originalGetItem(key);
};

localStorage.setItem = function(key, value) {
    if (sessionIsolatedKeys.includes(key)) {
        sessionStorage.setItem(key, value);
        return;
    }
    originalSetItem(key, value);
};

localStorage.removeItem = function(key) {
    if (sessionIsolatedKeys.includes(key)) {
        sessionStorage.removeItem(key);
        return;
    }
    originalRemoveItem(key);
};

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
