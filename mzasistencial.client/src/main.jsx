import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { AppProvider } from "./providers/AppProvider"

import 'bootstrap-css-only/css/bootstrap.css'
import 'devextreme/dist/css/dx.material.teal.light.compact.css'
import './index.css'

import.meta.glob(["./styles/**/*.css"], { eager: true });


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Suspense fallback={<div>Cargando...</div>}>
                <AppRoutes />
            </Suspense>
        </BrowserRouter>
    </StrictMode>,
)