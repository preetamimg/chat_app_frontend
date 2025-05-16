import { Phone, PhoneOff } from 'lucide-react'
import React from 'react'
import Avatar from './Avatar'

const IncomingCall = ({onAccept, userData, onReject}) => {
  console.log("userDatauserDatauserData", userData)
  return (
    <>
      <div className="fixed top-0 left-0 h-dvh w-dvw bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-blue-50 md:bg-white md:rounded-4xl size-full md:w-[22rem] md:h-auto flex flex-col overflow-hidden">
          <div className="top p-5 py-10 flex flex-col justify-center items-center h-full flex-1 max-md:bg-blue-50">
            <Avatar size={"big"} img={userData?.avtarUrl} name={userData?.userName}/>
            <div className="mt-2 text-xs text-gray-400">Incomming Call</div>
            <div className="mt-5 text-base font-semibold">{userData?.userName}</div>
            <div className="text-sm text-gray-500">{userData?.email}</div>
            {/* <audio autoPlay controls src="./assets/audio/incoming.mp3"></audio> */}
          </div>
          <div className="flex items-center justify-between bg-white md:bg-blue-50 p-6 max-md:px-8 max-md:py-10 rounded-t-4xl overflow-hidden">
            <button onClick={onAccept} className='size-10 bg-green-500 text-white rounded-full flex items-center justify-center cursor-pointer'><Phone size={16} /></button>
            <button onClick={onReject} className='size-10 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer'><PhoneOff size={16} /></button>
          </div>
        </div>
      </div>
    </>
  )
}

export default IncomingCall