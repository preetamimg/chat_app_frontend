import { PhoneOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import Avatar from './Avatar'

const CallScreen = ({onReject, remoteStream, myStream}) => {
  const [friend, setFriend] = useState({})

  useEffect(()=> {
    const friendDetails = JSON.parse(localStorage.getItem("ACTIVE_CHAT_USER"))?.friendDetails
    setFriend(friendDetails)
  }, [myStream])
  return (
    <>
      <div className="fixed top-0 left-0 h-dvh w-dvw bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-blue-50 md:bg-white md:rounded-4xl size-full md:w-3/5 md:h-auto md:aspect-video flex flex-col overflow-hidden relative">
          <div className="*:!size-full *:!object-cover size-full">
            {
              remoteStream ? 
                <ReactPlayer playing muted className="*:!size-full" url={remoteStream}/>
              : <div className="size-full flex items-center justify-center">
                <div className="flex flex-col gap-3 items-center">
                  <Avatar size={"big"} name={friend?.userName}/>
                  <div class="callloader"></div> 
                </div>
              </div>
            }
          </div>
          <div className="*:!size-full [&_video]:object-cover [&_video]:rounded-lg [&_video]:overflow-hidden w-25 md:w-[200px] aspect-[11/16] md:aspect-video absolute bg-white p-1.5 shadow-2xl bottom-3 right-3 z-50 rounded-2xl overflow-hidden">
            {
              myStream ? 
                <ReactPlayer playing muted className="*:!size-full" url={myStream}/>
              : "my stream"
            }
          </div>
          <button onClick={onReject} className='absolute bottom-0 left-1/2 -translate-y-1/2 size-10 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer'><PhoneOff size={16} /></button>
        </div>
      </div>
    </>
  )
}

export default CallScreen