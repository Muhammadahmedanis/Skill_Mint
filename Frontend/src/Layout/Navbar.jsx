import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileInfoCard from '../components/ProfileInfoCard';
import Logo from "/logo.png";
import Sidebar from '../components/Sidebar';

function Navbar() {
  const[isOpen, setIsOpen] = useState(false);
  
  return (
    <div className='h-20 bg-[#eae8e8] border-b border-gray-200/50 backdrop-blur-[12px] py-2.5 px-4 md:px-0 sticky top-0 z-30'>
        <div className='w-full max-w-7xl mx-auto flex items-center justify-between gap-5'>
            <Link to='/dashboard'>
             <div className=''>
                <img src={Logo} alt="" className='h-15' />
              </div>
            </Link>
            <div className='flex gap-2 items-center'>
                <ProfileInfoCard />
                <button
                onClick={() => setIsOpen(!isOpen)}
                  className='bg-gradient-to-r from-[#FF9324] to-[#e99a4b] hover:bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:text-white border border-white transition-colors cursor-pointer'>
                    Ace interview
                </button>
                    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
        </div>
    </div>
  )
}

export default Navbar