import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import App from './App'

// if (module.hot && process.env.NODE_ENV !== 'production') {
//   module.hot.accept()
// }

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)
