import React from 'react'

const Avatar = ({name, img, size}) => {
  return (
    <div className={` rounded-full overflow-hidden ${size === "big" ? "size-25 lg:size-25 *:!text-2xl bg-white" : "size-8 lg:size-10"}`}>
      {
        img ?    
        <img
        className="size-full object-cover"
        width={18}
        height={18}
        loading="lazy"
        quality={90}
        alt={`${name} image`}
        src={img}
      /> : 
      <div className="flex items-center justify-center size-full bg-[#2B04A6] text-white  text-xs lg:text-sm font-semibold uppercase">{name?.charAt(0)}</div>
      }
    </div>
  )
}

export default Avatar