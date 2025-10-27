import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import store from './store/store.js'
import './utils/axiosConfig.js'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Provider>
  </StrictMode>,
)
