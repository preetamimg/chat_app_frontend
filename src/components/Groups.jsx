import { useLocation, useNavigate } from 'react-router'
import NoData from './NoData'
import moment from 'moment'
import Avatar from './Avatar'
import { useGroup } from '../hooks/useGroup'
import { UserRoundPlus } from 'lucide-react'

const Groups = () => {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const {setShowOffcanvas, groupList} = useGroup()

  return (
    <>
      <ul className="m-0 p-0 list-none h-full">
        {
          groupList?.length ? groupList?.map((item) => (
            <li key={item?._id} onClick={()=> {
              localStorage.setItem("ACTIVE_CHAT_USER", JSON.stringify(item))
              navigate(`/${item?._id}`)
              }}>
                <div
                  className={`flex text-[0.9375rem] items-center mb-2 !no-underline rounded-lg gap-2.5 font-semibold text-[#344054] px-4 py-2 group hover:bg-[#2B04A6]/5 [&.active]:bg-[#2B04A6]/5 cursor-pointer ${
                    pathname?.includes(item?._id) ? "active border border-[#2B04A6]" : ""
                  } ${item?.unseenCount ? "bg-[#2B04A6]/5" : ''}`}
                >
                  <div className="relative">
                    <Avatar name={item?.groupName} img={item?.groupImage}/>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center w-full">
                      <div className="line-clamp-1">{item?.groupName}</div>
                      <div className="flex gap-1 items-center">
                        {
                          item?.lastMessage ? 
                          <div className="text-[0.625rem] w-fit bg-white px-1 flex items-center justify-center leading-2.5 h-4 rounded-lg">{moment(item?.messageTime).fromNow()}</div>
                          : ''
                        }
                          {
                            pathname?.includes(item?._id) ? "" : item?.unseenCount ?
                            <div className="text-[0.5rem] lg:text-[0.625rem] font-semibold text-white bg-blue-500 size-3 rounded-full flex items-center justify-center">{item?.unseenCount}</div> : ''
                          }
                      </div>
                    </div>
                    <div className="text-xs font-normal text-slate-500 line-clamp-1 break-all">{item?.lastMessage}</div>
                  </div>
                  
                </div>
            </li>
          )) : <div className="flex-1 h-full flex items-center justify-center">
            <NoData title="No Friends found" desc="Make friends and start chat"/>
          </div>
        }
      </ul>
      <div onClick={()=> setShowOffcanvas(true)} className="flex items-center justify-center size-12 min-h-12 rounded-full overflow-hidden bg-[#2B04A6] sticky right-4 lg:right-0 bottom-4 ml-auto cursor-pointer z-20 text-white">
        <UserRoundPlus size={20} />
      </div>
    </>
  )
}

export default Groups