import React from 'react'

const EmptyChat = () => {
  return (
    <>
      <div class="w-full flex items-center flex-wrap justify-center gap-10">
        <div class="grid gap-4 w-60">
        <img className='size-36 flex mx-auto' src="./assets/img/noChat.png" alt="" />
        <div>
        <h2 class="text-center text-black text-base font-semibold leading-relaxed pb-1">Conversation</h2>
        <p class="text-center text-black text-sm font-normal leading-snug pb-4">Select a chat to start conversation </p>
        </div>
        </div>
      </div>
    </>
  )
}

export default EmptyChat