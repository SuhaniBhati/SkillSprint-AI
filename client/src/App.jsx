import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import {AuthProvider} from './features/auth/auth.context.jsx';
import { Toaster } from "react-hot-toast";
function App() {
  

  return (

    <AuthProvider> 
    <RouterProvider router={router} />
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </AuthProvider>
  )
}

export default App
