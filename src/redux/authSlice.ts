import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode, JwtPayload } from 'jwt-decode'

interface Auth {
  authenticated: boolean,
  accessToken: string | null,
  expireTime: number | null,
  role: string | null,
  id: string | null,
}

const initialState: Auth = {
  authenticated: false,
  accessToken: null,
  expireTime: null,
  role: null,
  id: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.authenticated = true
      state.accessToken = action.payload
      const decode: any = jwtDecode(state.accessToken)
      state.id = decode.sub
      state.role = decode.auth
      state.expireTime = new Date().getTime()
    },
    deleteToken: (state) => {
      state.authenticated = false
      state.accessToken = null
      state.expireTime = null
    },
  },
})

export const { setToken, deleteToken } = authSlice.actions

export default authSlice.reducer