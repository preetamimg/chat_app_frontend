
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useProfile from "../hooks/useProfile";
import Avatar from "./Avatar";
import moment from "moment";
import { socket } from "../service/socket";
import FriendRequestOffcanvas from "./FriendRequestOffcanvas";
import MessageOffcanvas from "./MessageOffcanvas";
import SearchUserOffcanvas from "./SearchUserOffcanvas";
import NoData from "./NoData";
import UserProfileOffcanvas from "./UserProfileOffcanvas";

const Sidebar = () => {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const {token} = useProfile()
  const [ showSidebar, setShowSidebar ] = useState(false);
  const [friendsList, setFriendList] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(()=> {
    if(pathname === "/") {
      setShowSidebar(true)
    } else {
      setShowSidebar(false)
    }
  }, [pathname])

  useEffect(()=> {
    socket.on("user_friend_list", (requests) => {
      console.log("user_friend_list:", requests);
      setFriendList(requests)
    });
  }, [token])

  console.log("friendsListfriendsListfriendsList", friendsList)



  return (
    <>
      <div
        className={`sidebar w-full sm:w-[17.5rem] bg-white h-full overflow-hidden flex flex-col max-lg:h-dvh max-lg:fixed max-lg:z-20 transition-all duration-300 ease-in-out max-lg:top-0 max-lg:left-0 border-r border-[#EAECF0] ${
          pathname === "/" ? "" : "max-lg:-translate-x-full"
        }`}
      >
        <div className="sidebarHeader p-6 max-lg:p-4 max-lg:border-b border-[#EAECF0]">
          <div className="flex w-full">
            <Link className="lg:mb-6 flex flex-1 max-lg:-ml-1" to={'/'}>
              <img
                width={176}
                height={40}
                loading="lazy"
                quality={90}
                alt="logo"
                src={"./assets/img/logo1.png"}
                className="w-auto h-10 lg:h-[3.125rem] object-contain flex"
              />
            </Link>
            {
              pathname === "/" ? 
                <div className="flex lg:hidden gap-2">
                  <div className="a">
                    <SearchUserOffcanvas/>
                  </div>
                  <div className="a">
                    <FriendRequestOffcanvas/>
                  </div>
                  <div className="a">
                    <MessageOffcanvas/>
                  </div>
                </div>
              : ''
            }
          </div>
          <div className="hidden lg:flex relative">
            <img width={15} height={15} src={"./assets/img/searchIcon.png"} className="h-[0.9375rem] w-[0.9375rem] object-contain absolute top-1/2 left-4 -translate-y-1/2" alt="search icon"/>
            <input 
              value={searchQuery} 
              onChange={(e)=> setSearchQuery(e.target.value)}
              type="text" 
              className='text-base w-full h-11 rounded-lg border border-[#D0D5DD] pl-10 placeholder:text-[#667085] placeholder:font-normal ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50' 
              placeholder='Search your friends' 
            />
          </div>
        </div>
        <div className="sidebarContent h-full flex-1 overflow-y-auto px-0 lg:px-4 flex flex-col">
          <ul className="m-0 p-0 list-none h-full">
            {
              friendsList?.length ? friendsList?.map((item) => (
                <li key={item?.friendDetails?._id} onClick={()=> {
                  localStorage.setItem("ACTIVE_CHAT_USER", JSON.stringify(item))
                  navigate(`/${item?.chatId}`)
                  }}>
                    <div
                      className={`flex text-[0.9375rem] items-center mb-2 !no-underline rounded-lg gap-2.5 font-semibold text-[#344054] px-4 py-2 group hover:bg-[#2B04A6]/5 [&.active]:bg-[#2B04A6]/5 cursor-pointer ${
                        pathname?.includes(item?.chatId) ? "active border border-[#2B04A6]" : ""
                      } ${item?.unseenCount ? "bg-[#2B04A6]/5" : ''}`}
                    >
                      <div className="relative">
                        <Avatar name={item?.friendDetails?.userName} img={item?.friendDetails?.avtarUrl}/>
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between items-center w-full">
                          <div className="line-clamp-1">{item?.friendDetails?.userName}</div>
                          <div className="flex gap-1 items-center">
                            {
                              item?.lastMessage ? 
                              <div className="text-[0.625rem] w-fit bg-white px-1 flex items-center justify-center leading-2.5 h-4 rounded-lg">{moment(item?.messageTime).fromNow()}</div>
                              : ''
                            }
                              {
                                pathname?.includes(item?.chatId) ? "" : item?.unseenCount ?
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
        </div>
        <div className="sidebarBottom px-4">
          <UserProfileOffcanvas/>
        </div>
      </div>
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed bg-black/25 top-0 left-0 h-dvh w-full z-10 ${
          showSidebar ? "" : "hidden"
        } lg:hidden`}
      ></div>
    </>
  );
};

export default Sidebar;