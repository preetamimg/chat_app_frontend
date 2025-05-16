import React, { useCallback, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import peer from '../service/peer'
import { socket } from '../service/socket'

const AudioCall = ({userId, chatId}) => {

  const [myStream, setMyStream] = useState()
  const [remoteStream, setRemoteStream] = useState()
  const [incommingCall, setIncommingCall] = useState({
    isCall : false,
    callData : {}
  })

  console.log("remoteStream", remoteStream)
  
  const handleCallUser = async () => {
    const friendId = JSON.parse(localStorage.getItem("ACTIVE_CHAT_USER"))?.friendDetails?.friendId
    const stream = await navigator.mediaDevices.getUserMedia({
      audio : true,
      video : true
    })
    setMyStream(stream)
    const offer = await peer.getOffer();
    socket.emit("user-call", {to : friendId, from : userId , chatId : chatId, offer})
  }

  const handleIncomingCall = async (data) => {
    console.log("incoming call" ,  data?.from, data?.offer)
    setIncommingCall({
      isCall : true,
      callData : data
    })
  }

  const acceptIncomingCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio : true,
      video : true
    })
    setMyStream(stream)
    const answer = await peer.getAnswer(incommingCall?.callData?.offer)
    socket.emit("call-response", {to : incommingCall?.callData?.from, from : userId,  answer})
  }

    const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccept = async ({from, answer}) => {
    await peer.setRemoteDescription(answer);
    sendStreams()
  }

  const handleNegotiationNeeded = async () => {
    const friendId = JSON.parse(localStorage.getItem("ACTIVE_CHAT_USER"))?.friendDetails?.friendId;
    const offer = await peer.getOffer()
    socket.emit("negotiationneeded", {to : friendId, from: userId,  offer})
  }

  const handleNegoAccept = async ({from , offer}) => {
    const friendId = JSON.parse(localStorage.getItem("ACTIVE_CHAT_USER"))?.friendDetails?.friendId;
    const answer = await peer.getAnswer(offer)
    socket.emit("negotiationDone", {to : friendId, from : userId,  answer})
  }

  const handleFinalNego = async ({from, answer}) => {
    await peer.setRemoteDescription(answer)
    setTimeout(()=> {
      sendStreams()
    }, 300)
  }

  useEffect(()=> {
    peer.peer.addEventListener("track", ev => {
      const stream = ev?.streams
      setRemoteStream(stream?.[0])
    })
  }, [myStream])

  useEffect(()=> {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded)

    return ()=> {
    peer.peer.removeEventListener("negotiationneeded", handleNegotiationNeeded)
    }
  }, [])

  useEffect(()=> {
    socket.on("incomming-call", handleIncomingCall)
    socket.on("call-accepted", handleCallAccept)
    socket.on("negotiationneeded-accepted", handleNegoAccept)
    socket.on("negotiationneeded-final", handleFinalNego)


    return () => {
      socket.off("incomming-call", handleIncomingCall)
      socket.off("call-accepted", handleCallAccept)
      socket.off("negotiationneeded-accepted", handleNegoAccept)
      socket.off("negotiationneeded-final", handleFinalNego)
    }
  }, [chatId, userId, myStream, remoteStream])

  return (
    <>
    <div className="flex gap-3">

      <button onClick={handleCallUser} className='commonBtn'>Call User</button>
      {
        incommingCall?.isCall ? 
          <button onClick={acceptIncomingCall} className='commonBtn'>Receive Call</button>
        : ''
      }

      {myStream && <button className='commonBtn' onClick={sendStreams}>Send Stream</button>}
    </div>

      <div className="flex my-5">

      {
        myStream ? <div>
        <h6 className='text-center mb-3'>My Stream</h6>
        <ReactPlayer playing muted height={300} width={600} url={myStream}/>
        </div>
        : ''
      }
      {
        remoteStream ? <div>
        <h6 className='text-center mb-3'>remote Stream</h6>
        <ReactPlayer playing muted height={300} width={600} url={remoteStream}/>
        </div>
        : ''
      }
      </div>
    </>
  )
}

export default AudioCall