import { BrowserRouter, Routes, Route } from 'react-router-dom' // 추가!!

import Dashboard from './pages/Dashboard.tsx'
import BasicLayout from './components/Layouts/BasicLayout.tsx'
import User from './pages/User.tsx'
import Login from './pages/Login/Login.tsx'
import AlertDialog from './components/Alert/AlertDialog.tsx'
import Spinner from './components/Spinner/Spinner.tsx'
import * as React from 'react'
import Logout from './pages/Logout.tsx'
import ProtectedRoute from './components/Router/ProtectedRoute.tsx'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store.ts'
import PaymentHistory from './pages/PaymentHistory.tsx'


function Router() {


  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute isAuthenticated={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Route>

        <Route element={<ProtectedRoute isAuthenticated={true} />}>
          <Route element={<BasicLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<User />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router