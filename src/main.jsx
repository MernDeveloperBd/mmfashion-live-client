
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { Toaster } from 'react-hot-toast';
import {  Suspense } from 'react'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    }>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#283046',
            color: 'white',
            fontSize:'13px'
          }
        }}
      />
    </Suspense>

  </Provider>

)
