import React from 'react'
import SearchUser from './SearchUser'
import FriendRequestOffcanvas from './FriendRequestOffcanvas'
import MessageOffcanvas from './MessageOffcanvas'

const Header = () => {

  return (
    <>
      <div className='p-5 border-b border-[#EAECF0]'>
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchUser/>
          </div>
          <FriendRequestOffcanvas/>
          <MessageOffcanvas/>
        </div>
      </div>
    </>
  )
}

export default Header