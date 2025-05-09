import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../hoc/Layout'
import { socket } from '../../service/socket';
import useProfile from '../../hooks/useProfile';
import { useLocation } from 'react-router';
import { formDataAuth, postAPIAuth } from '../../service/apiInstance';
import { ImageUp, SendHorizontal, Trash2 } from 'lucide-react';
import ImageUploading from "react-images-uploading";
import moment from 'moment';
import Avatar from '../../components/Avatar';

const Chat = () => {
  const chatRef = useRef()
  const {user} = useProfile()
  const location = useLocation();
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [receivedMsg, setReceivedMsg] = useState([])
  const [image, setImage] = useState([])
  const [images, setImages] = React.useState([]);
  const [chatUser, setChatUser] = useState({})

  useEffect(()=> {
    const userDetails = localStorage.getItem("ACTIVE_CHAT_USER");
    const a = JSON.parse(userDetails)
    setChatUser(a)
  }, [location?.pathname]);

  console.log("chatUser", chatUser)

  const updateMsgStatus = async ()=> {
    try {
      const payload = {
        chatId : location?.pathname?.slice(1),
        userId : user?._id
      }
      const res = await postAPIAuth("chat/changeMessageStatus", payload)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    if(user?._id && location?.pathname?.slice(1)) {
      updateMsgStatus()
    }

  }, [user?._id, location?.pathname?.slice(1)])


  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
    handleImageUpload(imageList)
  };

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
    if(!newMessage?.trim().length && !image?.length) return
    // Send a message
    socket.emit('sendMessage', {
      chatId : location?.pathname?.slice(1),
      senderId: user?._id,
      content: newMessage,
      messageType: "text", // or 'image', 'video'
      mediaUrl: image?.length ? image : []
    });

    setNewMessage("")
    setImages([])
    setImage([])
  }

  useEffect(() => {
    // Scroll when messages change
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // const handleImageChange = (e) => {
  //   e.preventDefault();

  //   const img = e.target.files ? e.target.files?.[0] : ''
  //   if(img) {
  //     handleImageUpload(img)
  //   }
  // }

  const handleImageUpload = async (img) => {
    try {
      const formData = new FormData();
      img?.map(item => (
        formData.append("image", item?.file)
      ))
      const res = await formDataAuth("chat/createImage", formData)
      if(res?.data?.success) {
        setImage(res?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  console.log("messagessssssssssssssssssssssssssss", messages)



  return (
    <>
    <Layout>
      <div className="flex flex-col h-full overflow-hidden">
        <div ref={chatRef} className="flex-1 h-full overflow-y-auto p-5 chatScrollDiv">
          {
            messages?.length ?
              messages?.map(item => (
                <div key={item?._id} className={`mb-4 flex gap-3 ${item?.senderId?._id === user?._id ? '' :" flex-row-reverse"}`}>
                  <div className="flex-1">
                    {
                      item?.mediaUrl?.length ? 
                        item?.mediaUrl?.map(el => (
                          el ? 
                          <div key={el} className={`size-20 rounded-lg overflow-hidden mb-2 ${item?.senderId?._id === user?._id ? "text-righ ml-auto bg-blue-50" : 'bg-slate-50'}`}>
                            <img className='size-full object-contain' src={`https://apnicitybackend.onrender.com/${el}`} alt='img'/>
                          </div> : ''
                        ))
                      : ''
                    }
                    {
                      item?.content ? 
                      <div className={`py-1.5 lg:py-2 px-3 lg:px-4 text-xs lg:text-sm rounded-lg mb-2 w-fit max-w-1/2 break-all ${item?.senderId?._id === user?._id ? "text-righ ml-auto bg-blue-50" : 'bg-slate-50'}`}>
                        {item?.content}
                      </div>
                      : ''
                    }
                    <div className={`text-[0.5rem] lg:text-[0.625rem] font-semibold ${item?.senderId?._id === user?._id ? 'text-end' : ''}`}>{moment(item?.createdAt).fromNow()}</div>
                  </div>
                  <div className="a">
                    {
                      item?.senderId?._id === user?._id ? 
                        <Avatar name={user?.userName} img={user?.avtarUrl}/>
                      : <Avatar name={item?.senderId?.userName} img={item?.senderId?.avtarUrl}/>
                    }
                  </div>
                </div>
              ))
            : "no message"
          }
        </div>
        <div className="border-t border-slate-200 p-4 lg:p-5 relative">
          <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={4}
              dataURLKey="data_url"
              // acceptType={["jpg"]}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps
              }) => (
                // write your building UI
                <div className="upload__image-wrapper">
                  <button
                    style={isDragging ? { color: "red" } : null}
                    className={`size-10 flex items-center justify-center rounded-full absolute left-6 cursor-pointer bottom-5 lg:bottom-6`}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    {/* <div className='size-10 flex items-center justify-center rounded-full bg-blue-50 absolute left-8 cursor-pointer top-1/2 -translate-y-1/2'> */}
                      <ImageUp size={20} />
                    {/* </div> */}
                  </button>
                  {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
                  <div className={`flex gap-3 flex-wrap ${imageList?.length ? "mb-3" : ''}`}>
                    {imageList?.map((image, index) => (
                      <div key={index} className="image-item size-20 rounded-md bg-slate-50 overflow-hidden relative">
                        <img src={image.data_url} alt="" width="100" className='size-full object-contain' />
                        <div className="image-item__btn-wrapper">
                          {/* <button onClick={() => onImageUpdate(index)}>Update</button> */}
                          <button onClick={() => onImageRemove(index)} className='absolute size-6 bg-red-500 z-10 top-1 right-1 text-white rounded-full flex items-center justify-center'>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ImageUploading>
          <form className='flex items-center gap-4' onSubmit={handleSendMessage}>
            <textarea value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} className='border pl-12 border-slate-200 w-full flex-1 p-3 h-12 min-h-12 max-h-12 rounded-lg text-sm ' placeholder='Type a message...' />
            <button type='submit' className='commonBtn max-lg:!size-10 max-lg:!rounded-full max-lg:!p-0 max-lg:overflow-hidden'>
              <span className='hidden lg:flex'>Send</span>
              <SendHorizontal size={16} />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  </>
  )
}

export default Chat