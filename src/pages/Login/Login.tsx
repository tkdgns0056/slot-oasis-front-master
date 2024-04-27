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
import loginService from '../../services/loginService.ts'
import { useDispatch } from 'react-redux'
import { setToken } from '../../redux/authSlice.ts'
import { useNavigate } from 'react-router-dom'
import { setRefreshToken } from '../../storage/cookie.ts'
import useAlert from '../../hook/useAlert.ts'
import './Login.css'


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme()

export default function Login() {

  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { error } = useAlert()

  const handleLogin = async () => {

    if (id.trim() === '') {
      error('아이디를 입력해주세요')
      return false
    }

    if (password.trim() === '') {
      error('비밀번호를 입력해주세요')
      return false
    }

    loginService.login({ id, password }).then((res) => {
      const accessToken = res.data.payload.accessToken
      const refreshToken = res.data.payload.refreshToken
      if (res.data) {
        dispatch(setToken(accessToken))
        setRefreshToken(refreshToken)
        return navigate('/')
      }
    })
  }

  return (
    <Container
      component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            margin="normal"
            required
            fullWidth
            value={id}
            onChange={(e) => setId(e.target.value)}
            id="id"
            label="아이디"
            autoFocus
          />
          <TextField
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="비밀번호"
            type="password"
            id="password"
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            로그인
          </Button>
        </Box>
      </Box>
    </Container>
  )
}