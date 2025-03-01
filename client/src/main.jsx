import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Contexts/AuthContext.jsx'
import { SearchProvider } from './Contexts/SearchContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <SearchProvider>
            <Router>
                <App />
            </Router>
        </SearchProvider>
    </AuthProvider>
)
