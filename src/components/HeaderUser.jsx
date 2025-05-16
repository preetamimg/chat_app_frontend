import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import UserProfileOffcanvas from './UserProfileOffcanvas';
import { useGroup } from '../hooks/useGroup';

const HeaderUser = () => {
  const [user, setUser] = useState({})
  const location = useLocation()
  const {showOffcanvas} = useGroup()

    useEffect(()=> {
      const userDetails = localStorage.getItem("ACTIVE_CHAT_USER");
      const a = JSON.parse(userDetails)
      if(a?.isGroup) {
        setUser(a)
      } else if(a?.fromSearch) {
        setUser(a)
      }else {
        setUser(a?.friendDetails)
      }
    }, [location?.pathname, showOffcanvas]);

    if(location?.pathname === "/") return


  return (
    <>
      <UserProfileOffcanvas isAnother={true} anotherUser={user}/>
    </>
  )
}

export default HeaderUser