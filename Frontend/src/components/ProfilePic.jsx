import React, { useRef, useState } from 'react'
import { LuUser, LuTrash, LuUpload } from "react-icons/lu";

function ProfilePic({image, setImage, preview, setPriview}) {
    const inpRef = useRef(null);
    const[previewUrl, setPreviewUrl] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            setImage(file);
            const preview = URL.createObjectURL(file);
            if(setPriview){
                setPriview(preview);
            }
            setPreviewUrl(preview);
        }
    }

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        
        if(setPriview){
            setPriview(null);
        }
    }

    const chooseFile = () => {
        inpRef.current.click();
    }

  return (
    <div className='flex justify-center mb-6'>
        <input type="file" accept='image/*' ref={inpRef} onChange={handleImageChange} className='hidden' />
        {!image ? (
            <div className='w-20 h-20 flex items-center justify-center bg-orange-50 rounded-full relative cursor-pointer'>
                <LuUser className='text-orange-500' size={30} />
                <button onClick={chooseFile} className='w-8 h-8 flex items-center justify-center bg-linear-to-r from-orange-500/50 to-orange-600 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer '> <LuUpload />  </button>
            </div>
        ) : 
        (
            <div className='relative'>
                <img src={preview || previewUrl} alt="" className='w-20 h-20 rounded-full object-cover ' />
                <button onClick={handleRemoveImage} className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'> <LuTrash /> </button>
            </div>
        )
    }
    </div>
  )
}

export default ProfilePic