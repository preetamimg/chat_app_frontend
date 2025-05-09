import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import UserProfileOffcanvas from './UserProfileOffcanvas';

const HeaderUser = () => {
  const [user, setUser] = useState({})
  const location = useLocation()

    useEffect(()=> {
      const userDetails = localStorage.getItem("ACTIVE_CHAT_USER");
      const a = JSON.parse(userDetails)
      if(a?.isGroup) {
        setUser(a)
      } else {
        setUser(a?.friendDetails)
      }
    }, [location?.pathname]);

    if(location?.pathname === "/") return


  return (
    <>
      <UserProfileOffcanvas isAnother={true} anotherUser={user}/>
    </>
  )
}

export default HeaderUser