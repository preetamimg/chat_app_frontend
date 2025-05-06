import React from 'react'

const Loader = ({isWhite}) => {
  if (isWhite) return (
    <div className='loaderComp' style={{"--c" : "#fff 90%,#0000"}}></div>
  ) 

  return (
    <div className='loaderComp' style={{"--c" : "#000 90%,#0000"}}></div>
  )
}

export default Loader