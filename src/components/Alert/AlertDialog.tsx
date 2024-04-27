import { Alert, Snackbar } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hook/hooks.ts'
import { alertClose } from '../../redux/alertSlice'

export default function AlertDialog() {

  //const [open, setOpen] = useState(true)
  const open = useAppSelector(state => state.alert.open)
  const message = useAppSelector(state => state.alert.message)
  const severity = useAppSelector(state => state.alert.severity)
  const dispatch = useAppDispatch()
  const handleClose = () => {
    dispatch(alertClose())
  }

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
              ClickAwayListenerProps={{ onClickAway: () => null }}
              disableWindowBlurListener={true}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>

      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

