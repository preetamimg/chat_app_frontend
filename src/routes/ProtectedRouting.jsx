import { Navigate } from "react-router"
import { AUTH_TOKEN } from "../constant"

const ProtectedRouting = ({Component}) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  if (!token) {
      return <Navigate to={'/login'}/>
  } 
  else {
    return <Component/>
  } 
}

export default ProtectedRouting