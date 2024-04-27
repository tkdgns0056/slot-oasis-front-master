import { configureStore } from '@reduxjs/toolkit'
import { alertSlice } from './alertSlice.ts'
import { spinnerSlice } from './spinnerSlice.ts'
import { authSlice } from './authSlice.ts'

export const store = configureStore({
  reducer: {
    spinner: spinnerSlice.reducer,
    alert: alertSlice.reducer,
    auth: authSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
