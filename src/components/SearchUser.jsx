import React, { useEffect, useState } from 'react'
import { postAPIAuth } from '../service/apiInstance'
import Avatar from './Avatar'
import { toast } from 'react-toastify'
import Loader from './Loader'
import NoData from './NoData'
import { useNavigate } from 'react-router'

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  const fetchUsers = async ()=> {
    setIsLoading(true)
    try {
      const res = await postAPIAuth("user/search", {query : searchQuery})
      setUsers(res?.data?.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=> {
    setIsLoading(true)
    const timer = setTimeout(() => {
      if(searchQuery?.length) {
        fetchUsers()
      } else {
        setUsers([])
      }
    }, 300);
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSendFriendRequest = async (id) => {
    try {
      const res = await postAPIAuth('friendRequest/send', {friendId : id})
      console.log(res)
      if(res?.data?.success) {
        toast.success(res?.data?.message)
        fetchUsers()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="relative w-full lg:max-w-96">
        <img width={15} height={15} src={"./assets/img/searchIcon.png"} className="h-[0.9375rem] w-[0.9375rem] object-contain absolute top-[20px] lg:top-1/2 left-4 -translate-y-1/2" alt="search icon"/>
        <input 
          value={searchQuery} 
          onChange={(e)=> setSearchQuery(e.target.value)}
          type="text" 
          className='text-sm lg:text-base w-full h-10 lg:h-11 rounded-lg border border-[#D0D5DD] pl-10 placeholder:text-[#667085] placeholder:font-normal ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50' 
          placeholder='Search users...' 
        />
        {
          searchQuery?.length ? 
            <div className="lg:absolute lg:bg-white lg:rounded-lg lg:shadow lg:p-4 w-full left-0 top-[110%] max-lg:mt-8" >
              {
                isLoading ? 
                  <div className="flex items-center justify-center min-h-36">
                    <Loader/>
                  </div>
                :
                users?.length ? 
                  users?.map(item => (
                    <div key={item?._id} 
                      onClick={()=> {
                        if(item?.chatId?.length) {
                          localStorage.setItem("ACTIVE_CHAT_USER", JSON.stringify({fromSearch : true, ...item}))
                          navigate(`/${item?.chatId?.[0]}`)
                        } else return
                      }}  
                    className="flex p-3 lg:p-4 mb-2 border border-slate-300 rounded-lg justify-between items-center">
                      <div className={`${item?.isAlreadyFriend ? '' : 'max-w-3/5'}`}>
                        <div className="flex items-center gap-2 w-full">
                          <Avatar name={item?.userName}/>
                          <div className={`${item?.isAlreadyFriend ? '' : "max-w-[calc(100%_-_50px)]"}`}>
                            <div className="text-sm font-semibold line-clamp-1">{item?.userName}</div>
                            <div className="font-normal text-xs lg:text-sm line-clamp-1">{item?.email}</div>
                          </div>
                        </div>
                      </div>
                      {
                        item?.isAlreadyFriend ? '' : item?.friendRequestStatus ? 
                        <button disabled className='bg-[#2B04A6] text-white rounded-md text-[0.625rem] lg:text-xs font-semibold px-3 lg:px-4 h-8 lg:h-9 disabled:opacity-50'>Already Sent</button>
                        : 
                        <button onClick={()=>handleSendFriendRequest(item?._id)} className='bg-[#2B04A6] text-white rounded-md text-[0.625rem] lg:text-xs font-semibold px-3 lg:px-4 h-8 lg:h-9 cursor-pointer'>Add Friend</button>
                      }
                    </div>
                  ))
                : <div className="a">
                  <NoData/>
                </div>
              }
            </div>
          : ''
        }
      </div>
    </>
  )
}

export default SearchUser