import React, { useContext } from 'react'
import { ProfileContext } from '../context/profileContext'

const useProfile = () => {
  const {user, setUser, token, setToken, handleSignOut} = useContext(ProfileContext)
  return {user, setUser, token, setToken, handleSignOut}
}

export default useProfile