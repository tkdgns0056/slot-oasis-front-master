// src/ProtectedRoute.js
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store.ts'

interface ProtectedRouteProps {
  isAuthenticated: boolean
}

const ProtectedRoute = (props: ProtectedRouteProps) => {

  const authenticated = useSelector((state: RootState) => state.auth.authenticated)

  console.log(authenticated, !props.isAuthenticated)
  if (authenticated) {
    return !props.isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
  } else {
    return !props.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
  }
}

export default ProtectedRoute