import React from 'react'
import { Link } from 'react-router-dom'
import ProfileInfoCard from '../components/ProfileInfoCard';
import Logo from "/logo.png";

function Navbar() {
  return (
    <div className='h-20 bg-[#eae8e8] border-b border-gray-200/50 backdrop-blur-[12px] py-2.5 px-4 md:px-0 sticky top-0 z-30'>
        <div className='w-full max-w-7xl mx-auto flex items-center justify-between gap-5'>
            <Link to='/dashboard'>
             <div className=''>
                <img src={Logo} alt="" className='h-15' />
              </div>
                {/* <h2 className='text-lg md:text-xl font-medium text-black leading-5'>Interview Prep AI</h2> */}
            </Link>
            <ProfileInfoCard />
        </div>
    </div>
  )
}

export default Navbar