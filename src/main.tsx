import ReactDOM from 'react-dom/client'
import Router from './Router.tsx'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { CookiesProvider } from 'react-cookie'
import AlertDialog from './components/Alert/AlertDialog.tsx'
import Spinner from './components/Spinner/Spinner.tsx'
import * as React from 'react'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)
