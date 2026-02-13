import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import "@fortawesome/fontawesome-free/css/all.min.css";
import './src/Components/Admin/styles/global.css'
import { router } from './src/Router/AppRouter.tsx'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import PageLoader from "./src/Router/PageLoader";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
    <ToastContainer />
  </StrictMode>,
)
