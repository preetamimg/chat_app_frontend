import { createContext, useEffect, useState } from "react";
import {AUTH_TOKEN} from '../constant'
import { getAPIAuth } from "../service/apiInstance";
import { useNavigate } from "react-router";

export const ProfileContext = createContext(null)

const ProfileContextProvider = ({children}) => {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [token, setToken] = useState("")

  useEffect(()=> {
    const userToken = localStorage.getItem(AUTH_TOKEN)
    setToken(userToken)
  }, [])

  const fetchUserDetails = async () => {
    try {
      const res = await getAPIAuth('user/getUserDetails')
      if(res?.data?.success) {
        setUser(res?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    if(token) {
      fetchUserDetails()
    }
  }, [token])

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_TOKEN)
    setUser({})
    setToken("")
    navigate("/login")
  }
  
  return (
    <ProfileContext.Provider value={{user, setUser, token, setToken, handleSignOut, fetchUserDetails}}>
      {children}
    </ProfileContext.Provider>
  )
}

export default ProfileContextProvider