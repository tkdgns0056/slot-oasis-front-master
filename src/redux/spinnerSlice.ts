import { createSlice } from '@reduxjs/toolkit'

interface SpinnerState {
  show: boolean;
}

const initialState: SpinnerState = {
  show: false,
}

export const spinnerSlice = createSlice({
  name: 'spinner',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    showSpinner: (state) => {
      state.show = true
    },
    hideSpinner: (state) => {
      state.show = false
    },
  },
})

export const { showSpinner, hideSpinner } = spinnerSlice.actions
export default spinnerSlice.reducer