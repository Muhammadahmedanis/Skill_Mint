import { useActionState, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaRegEnvelope, FaRegEyeSlash } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import Input from '../components/Input';
import Label from '../components/Label';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axios';
import { API_PATH } from '../utils/apiPath';
import { useUser } from '../Context/userContext';

function Login({setCurrentPage}) {
  const navigate = useNavigate();
  const[passIcon, setPassIcon] = useState("password");
  const { updateUser } = useUser()

  const handlePass = () => {
    if (passIcon === "password") {
      setPassIcon("text");
    }else{
      setPassIcon("password")
    }
   }

  const[_, submitAction, isPending] = useActionState(async (previousSate, formData) => {
    const email = formData.get("email");
    const password = formData.get("password");
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

    try {
      const payload = { email, password };
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, payload);
      // console.log(response?.data);
      updateUser(response?.data);
      navigate("/dashboard");
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error.response.data.message);  
    }

  })


  return (
    <div className='w-[90vw] md:w-[31vw] py-5 px-7 flex flex-col justify-center'>

      <div className='text-center'>
        <div className='flex flex-col items-center gap-2 group'>
        
          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <p className='text-base-content/60'>Login to your account</p>
        </div>
      </div>
         <form action={submitAction}>
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
              {/* <Link to="/forgotPass" className="text-xs font-semibold absolute right-1 mt-2 mb-8 text-gray-500 dark:text-gray-300 hover:underline">
                Forget Password?
              </Link> */}
            </div>
            <button
              type='submit'
              disabled={isPending}
              className="btn-primary">
              { isPending ? <div className="w-7 h-7 border-4 border-t-primary border-gray-300 rounded-full animate-spin"></div> : <div className='text-[17px] font-semibold'>Login</div>} 
            </button>
            </form>
            <p className=''>Don't have an account <button className='font-medium text-primary underline cursor-pointer' onClick={() => setCurrentPage("Signup")}>SignUp</button> </p>
        </div>
  )
}

export default Login