import { alertOpen } from '../redux/alertSlice.ts'
import { useAppDispatch } from './hooks.ts'

export default function useAlert() {

  const dispatch = useAppDispatch()

  return {
    info: (message: string) => {
      dispatch(alertOpen({ message: message, severity: 'info' }))
    },
    success: (message: string) => {
      dispatch(alertOpen({ message: message, severity: 'success' }))
    },
    warning: (message: string) => {
      dispatch(alertOpen({ message: message, severity: 'warning' }))
    },
    error: (message: string) => {
      dispatch(alertOpen({ message: message, severity: 'error' }))
    },
  }
}