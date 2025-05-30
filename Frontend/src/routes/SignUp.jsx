import { useActionState, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaRegEnvelope, FaRegEyeSlash, FaRegUser } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import Input from '../components/Input';
import Label from '../components/Label';
import toast from 'react-hot-toast';
import ProfilePic from '../components/ProfilePic';
import { useUser } from '../Context/userContext';
import { API_PATH } from '../utils/apiPath';
import axiosInstance from '../utils/axios';

function Signup({setCurrentPage}) {
  const navigate = useNavigate();
  const[passIcon, setPassIcon] = useState("password");
  const[profilePic, setProfilePic] = useState(null);
  const { updateUser } = useUser();

  const handlePass = () => {
    if (passIcon === "password") {
      setPassIcon("text");
    }else{
      setPassIcon("password")
    }
   }

  const[_, submitAction, isPending] = useActionState(async (previousSate, formData) => {
    const userName = formData.get("userName");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!userName) {
        toast.error("Username is required");
        return null; 
    }
    if (!email) {
    toast.error("Email is required");
    return null;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        toast.error("Invalid email format");
        return null;
    }
    if (!password) {
        toast.error("Password is required");
        return null;
    } else if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return null;
    }

    const formD = new FormData();
    formD.append("userName", userName);
    formD.append("email", email);
    formD.append("password", password);

    if(profilePic){
      formD.append("profilePic", profilePic);
    }
    console.log(formD);
    try {
      const response = await axiosInstance.post(API_PATH.AUTH.SIGNUP, formD, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (!response?.data) {
        toast.error("Something went wrong. No data received.");
        return null;
      }

      updateUser(response.data);       
      navigate("/dashboard");
      toast.success(response.data.message);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Signup failed.");
    }

  })


  return (
    <div className='w-[90vw] md:w-[31vw] py-5 px-7 flex flex-col justify-center'>

      <div className='text-center'>
        <div className='flex flex-col items-center gap-2 group'>
        
          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <p className='text-base-content/60'>Create an Account</p>
        </div>
      </div>
        <ProfilePic image={profilePic} setImage={setProfilePic} />
         <form action={submitAction}>

            <div className='my-4'>
              <Label htmlFor="LoggingUsername" labelName="Username" />
              <div className="relative flex items-center">
                <span className="absolute right-1">
                  <FaRegUser className="w-5 h-5 mx-3 text-gray-300 dark:text-gray-500" />
                </span>
                <Input type="text" name="userName" placeholder="abc"  />
              </div>
            </div>

            <div className='my-4'>
              <Label htmlFor="LoggingEmailAddress" labelName="Email Address" />
              <div className="relative flex items-center">
                <span className="absolute right-1">
                  <FaRegEnvelope className="w-5 h-5 mx-3 text-gray-300 dark:text-gray-500" />
                </span>
                <Input type="email" name="email" placeholder="abc@gmail.com" />
              </div>
            </div>

            <div className='relative'>
              <Label htmlFor="LoggingPassword" labelName="Password" />
              <div className="relative flex items-center">
              <span onClick={handlePass} className="absolute right-1">
                  {passIcon === "password" ? <FaRegEyeSlash className="w-5 h-5 mx-3 cursor-pointer font-bold text-gray-400 dark:text-gray-500" /> : <IoEyeOutline className="w-5 h-5 mx-3 cursor-pointer text-gray-400 dark:text-gray-500" />}
                </span>
                <Input type={passIcon === "password" ? "password" : "text" } name="password" placeholder="Min 8 Characters" />
              </div>
            </div>
            <button
              type='submit'
              disabled={isPending}
              className="btn-primary">
              { isPending ? <div className="w-7 h-7 border-4 border-t-primary border-gray-300 rounded-full animate-spin"></div> : <div className='text-[17px] font-semibold'>Signup</div>} 
            </button>
            </form>
            <p className=''>Already have an account <button className='font-medium text-primary underline cursor-pointer' onClick={() => setCurrentPage("Login")}>Login</button> </p>
        </div>
  )
}

export default Signup