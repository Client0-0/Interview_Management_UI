import { StrictMode,Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import "@fortawesome/fontawesome-free/css/all.min.css";
import './Components/Admin/styles/global.css'
import { router } from './Router/AppRouter.tsx'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import PageLoader from "./Router/PageLoader";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer/>
  </StrictMode>,
)
