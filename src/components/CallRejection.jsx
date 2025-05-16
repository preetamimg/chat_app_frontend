
import { X } from 'lucide-react'
import Avatar from './Avatar'

const CallRejection = ({userData, showCallRejection, setShowCallRejection}) => {
  return (
    <>
      <div className="fixed top-0 left-0 h-dvh w-dvw bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-blue-50 md:bg-white md:rounded-4xl size-full md:w-[22rem] md:h-auto flex flex-col overflow-hidden relative">
          <div className="top p-5 py-10 flex flex-col justify-center items-center h-full flex-1 max-md:bg-blue-50">
            <Avatar size={"big"} img={userData?.avtarUrl} name={userData?.userName}/>
            <div className="mt-2 text-xs text-gray-400">
              {userData?.userName} {" "}
              {showCallRejection?.message === "reject" ? "rejected your call" : "ended call"}
              </div>
          </div>
          <button onClick={()=> setShowCallRejection({isOpen : false, message : ""})} className="cursor-pointer flex items-center justify-center absolute top-4 right-4">
            <X size={20}/>
          </button>
        </div>
      </div>
    </>
  )
}

export default CallRejection