import React from 'react'
import { Route, Routes } from 'react-router'
import Login from '../pages/auth/login/Login'
import Home from '../pages/home/Home'
import ProtectedRouting from './ProtectedRouting'
import Register from '../pages/auth/register/Register'
import Chat from '../pages/chat/Chat'

const RouteComponent = () => {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/' element={<ProtectedRouting Component={Home}/>}/>
        <Route path='/:id' element={<ProtectedRouting Component={Chat}/>}/>
      </Routes>
    </>
  )
}

export default RouteComponent