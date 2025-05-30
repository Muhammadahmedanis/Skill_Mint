import React from 'react'
import { useUser } from '../Context/userContext';
import { useNavigate } from 'react-router-dom';

function ProfileInfoCard() {
      const navigate = useNavigate();
    const {user, clearUser} = useUser();
    const handleLogout = () => {
        clearUser();
        navigate("/");
    }
  return (
    user && 
    <div className='flex items-center'>
        <img src={user?.profilePic} alt="" className='w-11 h-11 bg-gray-300 rounded-full mr-3' />
        <div>
            <div className='text-[15px] text-black font-bold leading-3'>{user?.userName || ""}</div>
            <button className='text-amber-600 text-sm font-semibold cursor-pointer hover:underline' onClick={handleLogout}>Logout</button>
        </div>
    </div>
  )
}

export default ProfileInfoCard