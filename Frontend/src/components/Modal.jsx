import React from 'react'
import { IoCloseCircleOutline } from "react-icons/io5";

function Modal({ children, isOpen, onClose, title}) { // hideHeader
  if(!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/40'>
        <div className='relative flex flex-col pt-2 bg-white shadow-lg rounded-lg overflow-hidden'>
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className='md:text-lg font-medium text-gray-900'>{title}</h3>
              </div>
            <button className='text-gray-400 bg-transparent  hover:text-orange-300 rounded-lg text-sm w-8 flex justify-center items-center absolute top-3.5 right-3.5 cursor-pointer' onClick={onClose}> <IoCloseCircleOutline size={25} /> </button>

            <div className='flex-1 overflow-y-auto custom-scrollbar'>{children}</div>
        </div>
    </div>
  )
}

export default Modal