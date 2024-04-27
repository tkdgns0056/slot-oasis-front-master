import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { CSSObject, styled, Theme } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import React from 'react'
import logo from '../../assets/logo.jpg'
import {
  Dashboard, Download,
  GroupAdd,

  Payments,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store.ts'

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
)

interface NavProps {
  open: boolean;
}

interface MenuItem {
  name: string;
  icon: React.JSX.Element;
  url?: string;
  auth?: string[];
}

export default function Nav({ open }: NavProps) {

  const role = useSelector((state: RootState) => state.auth.role)

  const navigate = useNavigate()
  const menuItems: Array<MenuItem> = [
    { name: '대시보드', icon: <Dashboard />, url: '/dashboard' },
    { name: '결제내역', icon: <GroupAdd />, url: '/payment-history', auth: ['ROLE_USER'] },
    { name: '회원관리', icon: <GroupAdd />, url: '/users', auth: ['ROLE_ADMIN', 'ROLE_SELLER'] },
    { name: '엑셀 Export', icon: <Download />, auth: ['ROLE_ADMIN'] },
  ]

  const handleMenuClick = (url?: string) => {
    if (url !== undefined) navigate(url)
  }

  return (
    <>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader onClick={() => navigate('/')} sx={{
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundColor: 'rgb(250 252 249)',
          cursor: 'pointer',
        }}>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            (!item.auth || (role && item.auth.includes(role)))
            && <ListItem key={item.name} disablePadding sx={{ display: 'block' }}
                         onClick={() => handleMenuClick(item.url)}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >

                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >

                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))
          }
        </List>
      </Drawer>
    </>
  )
}