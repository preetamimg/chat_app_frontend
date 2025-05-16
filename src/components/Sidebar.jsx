
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
import Groups from "./Groups";
import AudioCall from "./AudioCall";

const Sidebar = () => {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const {user} = useProfile()
  const {token} = useProfile()
  const [ showSidebar, setShowSidebar ] = useState(false);
  const [friendsList, setFriendList] = useState([])
  const [activeTab, setActiveTab] = useState("chat")

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
        className={`sidebar w-full lg:w-[17.5rem] bg-white h-full overflow-hidden flex flex-col max-lg:h-dvh max-lg:fixed max-lg:z-20 transition-all duration-300 ease-in-out max-lg:top-0 max-lg:left-0 border-r border-[#EAECF0] ${
          pathname === "/" ? "" : "max-lg:-translate-x-full"
        }`}
      >
        <div className="sidebarHeader p-4 max-lg:p-4 max-lg:border-b border-[#EAECF0]">
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
          <div className={`max-lg:mt-3 flex items-center h-10 border border-slate-200 rounded-lg overflow-hidden relative before:absolute before:h-full before:w-1/2 before:rounded-lg before:bg-[#2B04A6] before:top-0 before:z-10 before:transition-all before:duration-300 before:ease-in ${activeTab === "chat" ? "before:left-0" : "before:left-1/2"}`}>
            <button onClick={()=> setActiveTab("chat")} className={`w-1/2 flex items-center justify-center h-full text-sm font-medium relative z-20 cursor-pointer transition-all duration-300 ease-in  ${activeTab === "chat" ? "text-white" : 'text-black'}`}>Chats</button>
            <button onClick={()=> setActiveTab("group")} className={`w-1/2 flex items-center justify-center h-full text-sm font-medium relative z-20 cursor-pointer  transition-all duration-300 ease-in ${activeTab === "group" ? "text-white" : 'text-black'}`}>Group</button>
          </div>
        </div>
        <div className="sidebarContent h-full flex-1 overflow-y-auto px-0 lg:px-4 flex flex-col relative">
          {
            activeTab === "chat" ?
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
            : <Groups/>
          }
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
      <AudioCall userId={user?._id} chatId={location?.slice(1)}/>
    </>
  );
};

export default Sidebar;