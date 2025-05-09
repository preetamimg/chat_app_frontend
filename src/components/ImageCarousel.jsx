import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import React from 'react'

const ImageCarousel = ({show, setShow, images, activeIndex, setActiveIndex}) => {
  return (
    <div className={`fixed h-dvh w-dvw bg-black/50 top-0 left-0 flex flex-col items-center justify-center ${show ? "" : "hidden"}`}>
      <button onClick={()=> setShow(false)} className='absolute top-4 right-4 size-10 flex items-center justify-center rounded-full text-white bg-[#2B04A6] shadow cursor-pointer disabled:opacity-45'>
        <X  size={20}/>
      </button>
      <div className="w-4/5 h-4/5 flex justify-center gap-5 overflow-hidden">
        {
          images?.length ? 
            images?.map((item, index) => {
              if(activeIndex === index) {
                return (
                  <img src={item} className='w-full flex object-contain' alt="" />
                )
              } else return
            })
          : ''
        }
      </div>
      <button disabled={activeIndex === 0} className='absolute top-1/2 left-4 -translate-y-1/2 size-10 flex items-center justify-center rounded-full text-white bg-[#2B04A6] shadow cursor-pointer disabled:opacity-45' onClick={()=> {
        if(activeIndex !== 0 ) {
          setActiveIndex(activeIndex - 1)
        }
      }}>
        <ChevronLeft size={20}/>
      </button>
      <button disabled={activeIndex === (images?.length - 1)} className='absolute top-1/2 right-4 -translate-y-1/2 size-10 flex items-center justify-center rounded-full text-white bg-[#2B04A6] shadow cursor-pointer disabled:opacity-45' onClick={()=> {
        if(activeIndex !== (images?.length - 1) ) {
          setActiveIndex(activeIndex + 1)
        }
      }}>
        <ChevronRight size={20}/>
      </button>
    </div>
  )
}

export default ImageCarousel