import React, { useEffect, useState } from 'react'
import { postAPIAuth } from '../service/apiInstance'
import Avatar from './Avatar'
import { toast } from 'react-toastify'

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [users, setUsers] = useState([])

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
      <div className="relative max-w-96">
        <img width={15} height={15} src={"./assets/img/searchIcon.png"} className="h-[0.9375rem] w-[0.9375rem] object-contain absolute top-1/2 left-4 -translate-y-1/2" alt="search icon"/>
        <input 
          value={searchQuery} 
          onChange={(e)=> setSearchQuery(e.target.value)}
          type="text" 
          className='text-base w-full h-11 rounded-lg border border-[#D0D5DD] pl-10 placeholder:text-[#667085] placeholder:font-normal ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50' 
          placeholder='Search users...' 
        />
        {
          searchQuery?.length ? 
            <div className="absolute bg-white rounded-lg shadow p-4 w-full left-0 top-[110%]" >
              {
                isLoading ? "Loadinggggg........." :
                users?.length ? 
                  users?.map(item => (
                    <div key={item?._id} className="flex p-4 mb-2 border border-slate-300 rounded-lg justify-between items-center">
                      <div className="a">
                        <div className="flex items-center gap-3">
                          <Avatar name={item?.userName}/>
                          <div className="a">
                            <div className="font-semibold">{item?.userName}</div>
                            <div className="font-normal text-sm">{item?.email}</div>
                          </div>
                        </div>
                      </div>
                      {
                        item?.isAlreadyFriend ? '' : item?.friendRequestStatus ? 
                        <button disabled className='bg-black text-white rounded-md text-xs font-semibold px-4 h-9 disabled:opacity-50'>Already Sent</button>
                        : 
                        <button onClick={()=>handleSendFriendRequest(item?._id)} className='bg-black text-white rounded-md text-xs font-semibold px-4 h-9 cursor-pointer'>Add Friend</button>
                      }
                    </div>
                  ))
                : "No data"
              }
            </div>
          : ''
        }
      </div>
    </>
  )
}

export default SearchUser