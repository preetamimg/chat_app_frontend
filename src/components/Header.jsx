import React from 'react'
import SearchUser from './SearchUser'
import FriendRequestOffcanvas from './FriendRequestOffcanvas'
import MessageOffcanvas from './MessageOffcanvas'
import SearchUserOffcanvas from './SearchUserOffcanvas'
import HeaderUser from './HeaderUser'
import { useLocation } from 'react-router'

const Header = () => {
  const pathname = useLocation().pathname
  return (
    <>
      <div className='px-4 py-3 lg:p-5 border-b border-[#EAECF0]'>
        <div className="flex gap-3">
          <HeaderUser/>
          <div className="fle ml-auto lg:w-96">
            <div className="w-full hidden lg:flex">
              <SearchUser/>
            </div>
          </div>
          {
            pathname === "/" ? 
            <>    
              <div className="lg:hidden">
                <SearchUserOffcanvas/>
              </div>
              <FriendRequestOffcanvas/>
              <MessageOffcanvas/>
            </>
            : ''
          }
        </div>
      </div>
    </>
  )
}

export default Header