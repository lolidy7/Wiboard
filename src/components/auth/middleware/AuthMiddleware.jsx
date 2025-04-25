import React from 'react'
import { Navigate, Outlet } from 'react-router'


export default function AuthMiddleware() {
  const token = localStorage.getItem("authTokens")
  console.log(token)

  if(!token){
    return <Navigate to="/login" replace/>;
  }
  return (
    <div>
      <Outlet />
    </div>
  )
}
