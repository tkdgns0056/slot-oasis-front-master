import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import loginService from '../services/loginService.ts'
import { useDispatch } from 'react-redux'
import { deleteToken, setToken } from '../redux/authSlice.ts'
import { Link, useNavigate } from 'react-router-dom'
import { removeCookieToken, setRefreshToken } from '../storage/cookie.ts'
import useAlert from '../hook/useAlert.ts'


export default function Logout() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    loginService.logout({}).then((res) => {
      console.log('logout!!!!!!!!!!!')
      dispatch(deleteToken())
      removeCookieToken()
      return navigate('/login')
    })

  }, [])

  return (
    <>
      <Link to="/login" />
    </>
  )
}