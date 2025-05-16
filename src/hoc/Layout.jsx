import React, { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import useProfile from '../hooks/useProfile'
import { socket } from '../service/socket'
import { useLocation } from 'react-router'
import CreateGroupOffcanvas from '../components/CreateGroupOffcanvas'

const Layout = ({children}) => {
    const {user} = useProfile()
    const location = useLocation()
  
    useEffect(()=> {
        if (!user?._id) return;
    
        const registerSocket = () => {
          socket.emit("register", user?._id);
        };
    
        // Register immediately if already connected
        if (socket.connected) {
          registerSocket();
        } else {
          // Otherwise wait for connection
          socket.on("connect", registerSocket);
        }
    
        return () => {
          socket.off("connect", registerSocket); // clean up
        };
    }, [user?._id])

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar/>
      <div className={`content w-full lg:w-[calc(100%_-_17.5rem)] h-full overflow-hidden flex flex-col ${location?.pathname === "/" ? "max-lg:hidden" : ''}`}>
        <Header/>
        <div className="h-full flex-1 overflow-hidden">
          <div className="h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    <CreateGroupOffcanvas/>
    </div>
  )
}

export default Layout