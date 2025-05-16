import React, { useCallback, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import peer from '../service/peer'
import { socket } from '../service/socket'
import { Video } from 'lucide-react'
import IncomingCall from './IncomingCall'
import CallRejection from './CallRejection'
import CallScreen from './CallScreen'

const AudioCall = ({userId, chatId}) => {
  const [showCallRejection, setShowCallRejection] = useState({
    isOpen : false,
    message : ""
  })
  const [rejectUser, setRejectUser] = useState({})
  const [myStream, setMyStream] = useState()
  const [remoteStream, setRemoteStream] = useState()
  const [incommingCall, setIncommingCall] = useState({
    isCall : false,
    callData : {}
  })

  
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
    socket.emit("call-response", {to : incommingCall?.callData?.from?._id, from : userId,  answer})
    setIncommingCall(prev => ({
      ...prev,
      isCall : false
    }))
  }

  const rejectCall = async () => {
    socket.emit("call-rejected-response", {to : incommingCall?.callData?.from?._id, from : userId})

    setIncommingCall(prev => ({
      ...prev,
      isCall : false
    }))
  }

    const endCall = async () => {
    const friendId = JSON.parse(localStorage.getItem("ACTIVE_CHAT_USER"))?.friendDetails?.friendId
    socket.emit("end-call-response", {to : friendId, from : userId})
        if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }

    setMyStream()
    setRemoteStream()
  }

    const sendStreams = useCallback(() => {
      console.log("event chala")
    for (const track of myStream.getTracks()) {
      peer?.peer?.addTrack(track, myStream);
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
    setTimeout(()=> {
      sendStreams()
    }, 300)
  }

  const handleFinalNego = async ({from, answer}) => {
    await peer.setRemoteDescription(answer)
  }

  const handleCallRejection = (data) => {
    setRejectUser(data?.userDetails)
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }

    setMyStream()
    setRemoteStream()
    setShowCallRejection({
      isOpen : true,
      message : "reject"
    })
  }

    const handleCallEnd = (data) => {
      setRejectUser(data?.userDetails)
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }

    setMyStream()
    setRemoteStream()
    setIncommingCall(prev => ({
      ...prev,
      isCall : false
    }))
    setShowCallRejection({
      isOpen : true,
      message : "end"
    });
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
    socket.on("call-rejected", handleCallRejection)
    socket.on("call-ended", handleCallEnd)




    return () => {
      socket.off("incomming-call", handleIncomingCall)
      socket.off("call-accepted", handleCallAccept)
      socket.off("negotiationneeded-accepted", handleNegoAccept)
      socket.off("negotiationneeded-final", handleFinalNego)
      socket.off("call-rejected", handleCallRejection)
      socket.off("call-ended", handleCallEnd)
    }
  }, [chatId, userId, myStream, remoteStream])

  return (
    <>
      <button onClick={handleCallUser} className={`size-10 bg-blue-50 flex items-center justify-center rounded-full cursor-pointer ${location.pathname === "/" ? 'hidden' : ''}`}>
        <Video size={16} />
      </button>
      {
        incommingCall?.isCall ? 
          <IncomingCall onAccept={acceptIncomingCall} onReject={rejectCall} userData={incommingCall?.callData?.from}/>
        : ''
      }
      {
        showCallRejection?.isOpen ? 
        <CallRejection userData={rejectUser} showCallRejection={showCallRejection} setShowCallRejection={setShowCallRejection}/> 
        : ''
      }
      {
        myStream ? 
          <CallScreen myStream={myStream} remoteStream={remoteStream} onReject={endCall}/>
        : ''
      }
    </>
  )
}

export default AudioCall