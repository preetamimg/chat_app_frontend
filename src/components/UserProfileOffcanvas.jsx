import React, { useState } from 'react'
import { ArrowLeft, Pencil, Search, X } from 'lucide-react'
import SearchUser from './SearchUser'
import useProfile from '../hooks/useProfile'
import Avatar from './Avatar'
import { formDataAuth } from '../service/apiInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

const UserProfileOffcanvas = ({isAnother, anotherUser}) => {
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)
  const {user, handleSignOut, fetchUserDetails} = useProfile()
  

  const updateProfileImage = async (img)=> {
    try {
      const formData = new FormData() 
      formData.append("image", img)
      const res = await formDataAuth("user/update", formData)
      if(res?.data?.success) {
        fetchUserDetails()
        toast.success(res?.data?.message)
      }
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e)=> {
    e.preventDefault();
    const file = e.target.files && e.target.files?.[0];

    if(file) {
      updateProfileImage(file)
    }
  }

  console.log("anotherUser", anotherUser)

  return (
    <>
    {
      isAnother ? 
        <>
          <div className="flex items-center gap-2 mr-auto">
            <button className='lg:hidden' onClick={()=> navigate("/")}>
              <ArrowLeft  size={16}/>
            </button>
            <div className="cursor-pointer" onClick={()=>setShowSearch(true)}>
              <Avatar name={anotherUser?.isGroup ? anotherUser?.groupName :anotherUser?.userName} img={anotherUser?.isGroup ? anotherUser?.groupImage :anotherUser?.avtarUrl}/>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm font-semibold text-[#344054]">
                {anotherUser?.isGroup ? anotherUser?.groupName : anotherUser?.userName ? anotherUser?.userName : ''}
              </div>
              {
                anotherUser?.isGroup ? 
                <div className="text-[#475467] text-xs font-normal line-clamp-1">{anotherUser?.participants?.length} Members</div>
                : <div className="text-[#475467] text-xs font-normal line-clamp-1">{anotherUser?.email ? anotherUser?.email : ''}</div>
              }
            </div>
          </div>
        </> : 
        <>
          <div className="flex items-center gap-3 border-t border-[#EAECF0] py-4 lg:py-5 lg:pb-7">
            <div className="cursor-pointer" onClick={()=>setShowSearch(true)}>
              <Avatar name={user?.userName} img={user?.avtarUrl}/>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm font-semibold text-[#344054]">
                {user?.userName ? user?.userName : ''}
                <img onClick={handleSignOut} className="cursor-pointer ml-auto size-5" width={15} height={15} src={"./assets/img/logoutIcon.png"} alt="user"/>
              </div>
              <div className="text-[#475467] text-xs font-normal">{user?.email ? user?.email : ''}</div>
            </div>
          </div>
        </>
    }
      <div className={`z-50 fixed bg-white shadow w-full lg:w-[30rem] h-dvh top-0 right-0 overflow-hidden flex flex-col transition-all duration-500 ${showSearch ? '' : "translate-x-full"}`}>
        <div className="header p-5 border-b border-[#EAECF0] flex justify-between items-center">
          <div className="text-lg font-semibold capitalize">
            Contact Info
          </div>
          <button onClick={()=> setShowSearch(false)} className='cursor-pointer flex items-center justify-center'>
            <X size={20} />
          </button>
        </div>
        <div className="body p-5 flex-1 h-full overflow-y-auto">
          <div className="flex items-center justify-center flex-col">
            <input className='hidden' id='profileImg' type="file" accept='image/*' onChange={handleChange} />
            <div className="relative size-40 rounded-full bg-[#2B04A6]/5 flex items-center justify-center uppercase font-semibold text-2xl">
              <div className="size-full overflow-hidden rounded-full flex items-center justify-center">
                {
                  isAnother ? 
                    anotherUser?.avtarUrl ? 
                    <img src={anotherUser?.avtarUrl} className='size-full object-cover' alt='image'/>
                  : anotherUser?.userName?.charAt(0)
                  :
                  user?.avtarUrl ? 
                    <img src={user?.avtarUrl} className='size-full object-cover' alt='image'/>
                  : user?.userName?.charAt(0)
                }
              </div>
              {
                isAnother ? "" : 
                <label htmlFor="profileImg" className='size-5 bg-white rounded-full flex items-center justify-center absolute right-0 bottom-6 shadow'>
                  <Pencil size={12} />
                </label>
              }
            </div>
            <div className="text-lg font-semibold mt-4 capitalize">{isAnother ? anotherUser?.userName : user?.userName}</div>
            <div className="text-sm text-gray-500">{isAnother ? anotherUser?.email : user?.email}</div>
          </div>
        </div>
      </div>
      {
        showSearch ? <div onClick={()=> setShowSearch(false)} className="fixed bg-black/25 top-0 left-0 h-dvh w-full z-10 "></div> : ''
      }
    </>
  )
}

export default UserProfileOffcanvas