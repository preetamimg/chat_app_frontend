import React, { useEffect, useState } from 'react'
import { socket } from '../service/socket'
import { BellDot, UserPlus, X } from 'lucide-react'
import { getAPIAuth } from '../service/apiInstance'
import useProfile from '../hooks/useProfile'
import NoData from './NoData'


const MessageOffcanvas = () => {
  const [showMessage, setShowMessage] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadMessages, setUnreadMessages] = useState([])
  const {token} = useProfile()

  useEffect(()=> {
    // Listen for updated friend requests
    socket.on("notifications", (requests) => {
      console.log("Updated notifications:", requests);
      setNotifications(requests)
    });
  }, [showMessage, token])

  const updateNotificationStatus = async ()=> {
    try {
      const res = await getAPIAuth("/notification/updateStatus")
      return res
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = ()=> {
    updateNotificationStatus()
    setShowMessage(false)
  }

  useEffect(()=> {
    if(notifications?.length) {
      const unread = notifications?.filter(el => el?.isRead === false);
      setUnreadMessages(unread)
    }

  }, [notifications])

  return (
    <>
      <button onClick={()=>setShowMessage(true)} className='relative size-9 lg:size-11 rounded-md lg:rounded-lg border border-[#D0D5DD] flex items-center justify-center text-[#667085] font-semibold cursor-pointer'>
        <BellDot className='size-4 lg:size-5' />
        <div className="absolute size-3 bg-red-600 text-[0.625rem] font-semibold flex items-center justify-center rounded-full top-0 right-0 text-white">{unreadMessages?.length}</div>
      </button>
      <div className={`z-50 fixed bg-white shadow w-full lg:w-[30rem] h-dvh top-0 right-0 overflow-hidden flex flex-col transition-all duration-500 ${showMessage ? '' : "translate-x-full"}`}>
        <div className="header p-5 border-b border-[#EAECF0] flex justify-between items-center">
          <div className="text-lg font-semibold">Notifications</div>
          <button onClick={handleClose} className='cursor-pointer flex items-center justify-center'>
            <X size={20} />
          </button>
        </div>
        <div className="body p-5 flex-1 h-full overflow-y-auto">
          {
            notifications?.length ?
            notifications?.map(item => (
              <div key={item?._id} className={`flex p-3 lg:p-4 mb-2 border border-slate-300 rounded-lg justify-between items-center ${item?.isRead ? 'opacity-40' : ''}`}>
              <div className="a">
                <div className="flex items-center gap-3">
                  <div className="a">
                    <div className="text-xs lg:text-sm font-semibold">{item?.message}</div>
                    {/* <div className="font-normal text-sm">{item?.from?.email}</div> */}
                  </div>
                </div>
              </div>
            </div>
            ))
            : <div className="flex-1 h-full flex items-center justify-center">
            <NoData/>
          </div>
          }
        </div>
      </div>
      {
        showMessage ? <div onClick={handleClose} className="fixed bg-black/25 top-0 left-0 h-dvh w-full z-10 "></div> : ''
      }
    </>
  )
}

export default MessageOffcanvas