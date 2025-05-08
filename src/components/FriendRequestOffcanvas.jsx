import React, { useEffect, useState } from 'react'
import { socket } from '../service/socket'
import { UserPlus, X } from 'lucide-react'
import Avatar from './Avatar'
import { postAPIAuth } from '../service/apiInstance'
import { toast } from 'react-toastify'
import useProfile from '../hooks/useProfile'
import NoData from './NoData'

const FriendRequestOffcanvas = () => {
  const [showFriendRequest, setShowFriendRequest] = useState(false)
  const [friendRequests, setFriendRequests] = useState([])
  const {token} = useProfile()

  useEffect(()=> {
    // Listen for updated friend requests
    socket.on("all_friend_requests", (requests) => {
      console.log("Updated friend requests:", requests);
      setFriendRequests(requests)
    });
  }, [showFriendRequest, token])

  const handleRequestAction = async (item, status)=> {
    try {
      const body = {
        friendId : item?.from?._id, 
        requestId : item?._id,
        status
      }
      const res = await postAPIAuth('friendRequest/action', body)
      if(res?.data?.success) {
        toast.success(res?.data?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <button onClick={()=>setShowFriendRequest(true)} className='relative size-9 lg:size-11 rounded-md lg:rounded-lg border border-[#D0D5DD] flex items-center justify-center text-[#667085] font-semibold cursor-pointer'>
        <UserPlus className='size-4 lg:size-5' />
        <div className="absolute size-3 bg-red-600 text-[0.625rem] font-semibold flex items-center justify-center rounded-full top-0 right-0 text-white">{friendRequests?.length}</div>
      </button>
      <div className={`z-50 fixed bg-white shadow w-full lg:w-[30rem] h-dvh top-0 right-0 overflow-hidden flex flex-col transition-all duration-500 ${showFriendRequest ? '' : "translate-x-full"}`}>
        <div className="header p-5 border-b border-[#EAECF0] flex justify-between items-center">
          <div className="text-lg font-semibold">Friend Requests</div>
          <button onClick={()=> setShowFriendRequest(false)} className='cursor-pointer flex items-center justify-center'>
            <X size={20} />
          </button>
        </div>
        <div className="body p-5 flex-1 h-full overflow-y-auto">
          {
            friendRequests?.length ?
            friendRequests?.map(item => (
              <div key={item?._id} className="flex p-4 mb-2 border border-slate-300 rounded-lg justify-between items-center">
              <div className="a">
                <div className="flex items-center gap-3">
                  <Avatar name={item?.from?.userName}/>
                  <div className="a">
                    <div className="font-semibold">{item?.from?.userName}</div>
                    <div className="font-normal text-sm">{item?.from?.email}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={()=> handleRequestAction(item, "accepted")} className='bg-green-600 text-white rounded-md text-xs font-semibold px-4 h-9 disabled:opacity-50'>Accept</button>
                <button onClick={()=> handleRequestAction(item, "rejected")} className='bg-red-600 text-white rounded-md text-xs font-semibold px-4 h-9 cursor-pointer'>Reject</button>
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
        showFriendRequest ? <div onClick={()=> setShowFriendRequest(false)} className="fixed bg-black/25 top-0 left-0 h-dvh w-full z-10 "></div> : ''
      }
    </>
  )
}

export default FriendRequestOffcanvas