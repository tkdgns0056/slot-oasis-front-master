import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AlertState {
  open?: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

const initialState: AlertState = {
  open: false,
  message: '',
  severity: 'info',
}

export const alertSlice = createSlice({
  name: 'alert',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    alertOpen: (state, action: PayloadAction<AlertState>) => {
      state.open = true
      state.message = action.payload.message
      state.severity = action.payload.severity
    },
    alertClose: (state) => {
      state.open = false
    },
  },
})

export const { alertOpen, alertClose } = alertSlice.actions
export default alertSlice.reducer