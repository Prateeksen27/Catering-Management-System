import { rolePermissions } from '@/config/rolePermissions'
import { useAuthStore } from '@/store/useAuthStore'
import React from 'react'
import { Navigate } from 'react-router-dom'

const RoleDashboardRedirect = () => {
    const {user} = useAuthStore()
    const redirectPath = rolePermissions[user.empType]?.dashboard || '/login'
  return <Navigate to={redirectPath} replace />;
}

export default RoleDashboardRedirect