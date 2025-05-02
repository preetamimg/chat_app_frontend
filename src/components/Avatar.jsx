import React from 'react'

const Avatar = ({name, img}) => {
  return (
    <div className="size-10 rounded-full overflow-hidden">
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
      <div className="flex items-center justify-center size-full bg-black text-white font-semibold">{name?.charAt(0)}</div>
      }
    </div>
  )
}

export default Avatar