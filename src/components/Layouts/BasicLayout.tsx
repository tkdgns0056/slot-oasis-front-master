import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

import CssBaseline from '@mui/material/CssBaseline'

import Header from '../../components/Layouts/Header.tsx'
import Nav from '../../components/Layouts/Nav.tsx'
import { Outlet } from 'react-router-dom'
import AlertDialog from '../Alert/AlertDialog.tsx'
import Spinner from '../Spinner/Spinner.tsx'

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))


export default function BasicLayout() {
  // const theme = useTheme()
  const [open, setOpen] = React.useState(true)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header open={open} onDrawerClick={handleDrawerOpen} />
      <Nav open={open} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>

    </Box>
  )
}

