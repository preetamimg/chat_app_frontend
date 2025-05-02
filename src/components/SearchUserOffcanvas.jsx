import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import SearchUser from './SearchUser'

const SearchUserOffcanvas = () => {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <>
      <button onClick={()=>setShowSearch(true)} className='relative size-11 rounded-lg border border-[#D0D5DD] flex items-center justify-center text-[#667085] font-semibold cursor-pointer'>
        <Search size={20} />
      </button>
      <div className={`z-50 fixed bg-white shadow w-full lg:w-[30rem] h-dvh top-0 right-0 overflow-hidden flex flex-col transition-all duration-500 ${showSearch ? '' : "translate-x-full"}`}>
        <div className="header p-5 border-b border-[#EAECF0] flex justify-between items-center">
          <div className="text-lg font-semibold">Search Friends</div>
          <button onClick={()=> setShowSearch(false)} className='cursor-pointer flex items-center justify-center'>
            <X size={20} />
          </button>
        </div>
        <div className="body p-5 flex-1 h-full overflow-y-auto">
          <SearchUser/>
        </div>
      </div>
      {
        showSearch ? <div onClick={()=> setShowSearch(false)} className="fixed bg-black/25 top-0 left-0 h-dvh w-full z-10 "></div> : ''
      }
    </>
  )
}

export default SearchUserOffcanvas