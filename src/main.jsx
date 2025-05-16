import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import ProfileContextProvider from './context/profileContext';
import GroupContextProvider from './context/groupContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProfileContextProvider>
        <GroupContextProvider>
          <App />
        </GroupContextProvider>
      </ProfileContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
