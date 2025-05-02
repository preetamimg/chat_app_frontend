import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../hoc/Layout'
import { socket } from '../../service/socket';
import useProfile from '../../hooks/useProfile';
import { useLocation } from 'react-router';

const Chat = () => {
  const chatRef = useRef()
  const {user} = useProfile()
  const location = useLocation();
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [receivedMsg, setReceivedMsg] = useState([])

  useEffect(()=> {
    // Join the chat room
    socket.emit('joinChat', { chatId : location?.pathname?.slice(1) , userId : user?._id});

    // Load previous messages
    socket.on('chatHistory', (messages) => {
      setMessages(messages)
    });

  }, [location.pathname])

  useEffect(()=> {
    // Handle new messages
    socket.on('receiveMessage', (message) => {
      setReceivedMsg(message)
    });
  }, [])

  useEffect(()=> {
      const checkIfMsgExist = messages?.filter(el => el?._id === receivedMsg?._id);

      if (checkIfMsgExist?.length) {
        return
      } else {
        setMessages(prev => ([
          ...prev,
          receivedMsg
        ]))
      }
  }, [receivedMsg])


  const handleSendMessage = (e) => {
    e.preventDefault()
    // Send a message
    socket.emit('sendMessage', {
      chatId : location?.pathname?.slice(1),
      senderId: user?._id,
      content: newMessage,
      messageType: "text", // or 'image', 'video'
      mediaUrl: ""
    });

    setNewMessage("")
  }

  useEffect(() => {
    // Scroll when messages change
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
    <Layout>
      <div className="flex flex-col h-full overflow-hidden">
        <div ref={chatRef} className="flex-1 h-full overflow-y-auto p-5">
          {
            messages?.length ?
              messages?.map(item => (
                <div key={item?._id} className={`py-2 px-4 text-sm rounded-lg mb-2 w-fit max-w-1/2 ${item?.senderId?._id === user?._id ? "text-righ ml-auto bg-blue-50" : 'bg-slate-50'}`}>{item?.content}</div>
              ))
            : "no message"
          }
        </div>
        <div className="border-t border-slate-200 p-5">
          <form className='flex items-center gap-4' onSubmit={handleSendMessage}>
            <textarea accept="image/*" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} className='border border-slate-200 w-full flex-1 p-3 min-h-13 max-h-32 rounded-lg' type="text" />
            <button type='submit' className='commonBtn'>Send</button>
          </form>
        </div>
      </div>
    </Layout>
  </>
  )
}

export default Chat