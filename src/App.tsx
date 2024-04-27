import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CssBaseline from '@mui/material/CssBaseline'
import { CookiesProvider } from 'react-cookie'
import { Provider, useDispatch } from 'react-redux'
import { store } from './redux/store.ts'
import Router from './Router.tsx'
import AlertDialog from './components/Alert/AlertDialog.tsx'
import Spinner from './components/Spinner/Spinner.tsx'
import * as React from 'react'
import { RouterProvider } from 'react-router-dom'
import loginService from './services/loginService.ts'
import { setToken } from './redux/authSlice.ts'
import { existRefreshToken } from './storage/cookie.ts'


function App() {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (existRefreshToken()) {
      loginService.refresh().then((res) => {
        const accessToken = res.data.payload.accessToken
        store.dispatch(setToken(accessToken))
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  console.log('loading', window.location.href)

  return (
    !loading &&
    <>
      <CssBaseline />
      <CookiesProvider>
        <Provider store={store}>
          <Router />
          <AlertDialog />
          <Spinner />
        </Provider>
      </CookiesProvider>
    </>
  )
}

export default App
