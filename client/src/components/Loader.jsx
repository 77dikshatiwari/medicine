import React from 'react'

const Loader = ({loading}) => {
    if(!loading) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
      <div className="relative w-36 h-36">
        <div className="absolute w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-[spin_2s_linear_infinite]" />
        <div className="absolute w-full h-full border-4 border-transparent border-t-green-500 rounded-full animate-[spin_2s_linear_infinite] delay-[0.5s]" />
        <div className="absolute w-full h-full border-4 border-transparent border-t-red-500 rounded-full animate-[spin_2s_linear_infinite] delay-[1s]" />
      </div>
    </div>
  )
}

export default Loader
