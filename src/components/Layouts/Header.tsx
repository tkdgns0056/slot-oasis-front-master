import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar/AppBar'
import { Button, Chip } from '@mui/material'
import { AdminPanelSettings, Face2, Logout, Person, Storefront } from '@mui/icons-material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store.ts'
import { deleteToken } from '../../redux/authSlice.ts'
import { removeCookieToken } from '../../storage/cookie.ts'


const drawerWidth = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface HeaderProps {
  open: boolean;

  onDrawerClick(): void;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

export default function Header({ open, onDrawerClick }: HeaderProps) {

  const id = useSelector((state: RootState) => state.auth.id)
  const role = useSelector((state: RootState) => state.auth.role)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(deleteToken())
    removeCookieToken()
    navigate('/login')
  }

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerClick}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          </Typography>

          {
            role === 'ROLE_USER' && <Chip sx={{ mr: 2 }} color="success" icon={<Person />} label={id} />
          }
          {
            role === 'ROLE_SELLER' && <Chip sx={{ mr: 2 }} color="warning" icon={<Storefront />} label={id} />
          }
          {
            role === 'ROLE_ADMIN' && <Chip sx={{ mr: 2 }} color="error" icon={<AdminPanelSettings />} label={id} />
          }
          <Logout sx={{ cursor: 'pointer' }} onClick={handleLogout}>
          </Logout>
        </Toolbar>
      </AppBar>
    </>
  )
}