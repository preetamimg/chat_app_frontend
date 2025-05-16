import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../hoc/Layout'
import { socket } from '../../service/socket';
import useProfile from '../../hooks/useProfile';
import { useLocation } from 'react-router';
import { formDataAuth, getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { ImageUp, Mic, SendHorizontal, Trash2 } from 'lucide-react';
import ImageUploading from "react-images-uploading";
import moment from 'moment';
import Avatar from '../../components/Avatar';
import EmptyChat from '../../components/EmptyChat';
import ImageCarousel from '../../components/ImageCarousel';
import AudioCall from '../../components/AudioCall';

const Chat = () => {
  const chatRef = useRef()
  const {user} = useProfile()
  const location = useLocation();
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [receivedMsg, setReceivedMsg] = useState([])
  const [image, setImage] = useState([])
  const [images, setImages] = React.useState([]);
  const [chatImages, setChatImages] = useState([])
  const [showImage, setShowImage] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateMsgStatus = async ()=> {
    try {
      const payload = {
        chatId : location?.pathname?.slice(1),
        userId : user?._id
      }
      const res = await postAPIAuth("chat/changeMessageStatus", payload)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchChatImages = async ()=> {
    try {
      const res = await getAPIAuth(`chat/getImages?id=${location?.pathname?.slice(1)}`)
      if(res?.data?.success) {
        setChatImages(res?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    if(user?._id && location?.pathname?.slice(1)) {
      updateMsgStatus();
      fetchChatImages()
    }
  }, [user?._id, location?.pathname?.slice(1), showImage])



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
      if(receivedMsg?.mediaUrl?.length) {
        fetchChatImages()
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

  const handleImgPreview = (el)=> {
    const requiredIndex = chatImages?.indexOf(el);
    if(requiredIndex) {
      setActiveIndex(requiredIndex);
    } else {
      handleImgPreview(el)
    }
    setShowImage(true)
  }


  return (
    <>
    <Layout>
      <div className="flex flex-col h-full overflow-hidden">
        <div ref={chatRef} className="flex-1 h-full overflow-y-auto p-5 chatScrollDiv">
        {/* <AudioCall userId={user?._id} peerId={location?.pathname?.slice(1)}/> */}
        <AudioCall userId={user?._id} chatId={location?.pathname?.slice(1)}/>
          {
            messages?.length ?
              messages?.map(item => (
                <div key={item?._id} className={`mb-4 flex gap-3 ${item?.senderId?._id === user?._id ? '' :" flex-row-reverse"}`}>
                  <div className="flex-1">
                    {
                      item?.mediaUrl?.length ? 
                        item?.mediaUrl?.map(el => (
                          el ? 
                          <div onClick={()=> handleImgPreview(el?.img)} key={el?.img} className={`size-20 rounded-lg overflow-hidden mb-2 ${item?.senderId?._id === user?._id ? "text-righ ml-auto bg-blue-50" : 'bg-slate-50'}`}>
                            <img className='size-full object-contain' src={el?.img} alt='img'/>
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
            : <div className="flex items-center justify-center h-full">
              <EmptyChat title='No Message' desc="Start messaging"/>
            </div>
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
                      <ImageUp size={20} />
                  </button>
                  <div className={`flex gap-3 flex-wrap ${imageList?.length ? "mb-3" : ''}`}>
                    {imageList?.map((image, index) => (
                      <div key={index} className="image-item size-20 rounded-md bg-slate-50 overflow-hidden relative">
                        <img src={image.data_url} alt="" width="100" className='size-full object-contain' />
                        <div className="image-item__btn-wrapper">
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
            <button
              className={`size-10 flex items-center justify-center rounded-full absolute right-36 cursor-pointer bottom-5 lg:bottom-6`}
            >
                <Mic size={20}/>
            </button>
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
    <ImageCarousel images={chatImages} show={showImage} setShow={setShowImage} activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>
  </>
  )
}

export default Chat