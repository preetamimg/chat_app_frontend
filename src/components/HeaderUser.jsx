import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import Avatar from './Avatar';
import { ArrowLeft } from 'lucide-react';

const HeaderUser = () => {
  const [user, setUser] = useState({})
  const location = useLocation()
  const navigate = useNavigate()

    useEffect(()=> {
      const userDetails = localStorage.getItem("ACTIVE_CHAT_USER");
      const a = JSON.parse(userDetails)?.friendDetails
      setUser(a)
    }, [location?.pathname]);

    if(location?.pathname === "/") return


  return (
    <>
      <div className="flex items-center gap-3 mr-auto">
        <button className='lg:hidden' onClick={()=> navigate("/")}>
          <ArrowLeft  size={16}/>
        </button>
        <div className="size-10 rounded-full overflow-hidden">
          <Avatar name={user?.userName} img={user?.avtarUrl}/>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm font-semibold text-[#344054]">
            {user?.userName ? user?.userName : ''}
          </div>
          <div className="text-[#475467] text-xs font-normal">{user?.email ? user?.email : ''}</div>
        </div>
      </div>
    </>
  )
}

export default HeaderUser