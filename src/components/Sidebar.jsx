
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useProfile from "../hooks/useProfile";
import Avatar from "./Avatar";
import moment from "moment";
import { socket } from "../service/socket";
import FriendRequestOffcanvas from "./FriendRequestOffcanvas";
import MessageOffcanvas from "./MessageOffcanvas";
import SearchUserOffcanvas from "./SearchUserOffcanvas";

const Sidebar = () => {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const {token, user, handleSignOut} = useProfile()
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



  return (
    <>
      <div
        className={`sidebar w-full sm:w-[17.5rem] bg-white h-full overflow-hidden flex flex-col max-lg:h-dvh max-lg:fixed max-lg:z-20 transition-all duration-300 ease-in-out max-lg:top-0 max-lg:left-0 border-r border-[#EAECF0] ${
          pathname === "/" ? "" : "max-lg:-translate-x-full"
        }`}
      >
        <div className="sidebarHeader p-6">
          <div className="flex max-lg:mb-6 w-full">
            <Link className="lg:mb-6 flex flex-1" to={'/'}>
              <img
                width={144}
                height={32}
                loading="lazy"
                quality={90}
                alt="logo"
                src={"./assets/img/logo.png"}
                className="w-44 h-10 object-contain flex -ml-6"
              />
            </Link>
            <div className="flex lg:hidden gap-3">
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
          </div>
          <div className="relative">
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
        <div className="sidebarContent h-full flex-1 overflow-y-auto px-4 flex flex-col">
          <ul className="m-0 p-0 list-none flex-1">
            {
              friendsList?.length ? friendsList?.map((item) => (
                <li key={item?.friendDetails?._id} onClick={()=> navigate(`/${item?.chatId}`)}>
                    <div
                      className={`flex text-[0.9375rem] items-center mb-2 !no-underline rounded-lg gap-2.5 font-semibold text-[#344054] px-4 py-2 group hover:bg-blue-50 [&.active]:bg-blue-50 cursor-pointer ${
                        pathname?.includes(item?.chatId) ? "active" : ""
                      }`}
                    >
                      <div className="relative">
                        <Avatar name={item?.friendDetails?.userName} img={item?.friendDetails?.avtarUrl}/>
                        {/* <div className="absolute right-0 bottom-0 size-1.5 rounded-full bg-green-500"></div> */}
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between items-center w-full">
                          <div className="line-clamp-1">{item?.friendDetails?.userName}</div>
                          <div className="text-[10px] w-fit bg-white px-1 flex items-center justify-center leading-2.5 h-4 rounded-lg">{moment(item?.messageTime).fromNow()}</div>
                        </div>
                        <div className="text-xs font-normal text-slate-500 line-clamp-1">{item?.lastMessage}</div>
                      </div>
                      
                    </div>
                </li>
              )) : "No friends yet"
            }
          </ul>

          <div className="flex items-center gap-3 border-t border-[#EAECF0] py-5 pb-7">
            <div className="size-10 rounded-full overflow-hidden">
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