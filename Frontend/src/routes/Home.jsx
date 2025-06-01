import { useState } from 'react'
import { APP_FEATURES } from '../utils/data.js'
import { useNavigate } from 'react-router-dom'
import { LuSparkles } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import Modal from '../components/Modal.jsx';
import { useUser } from '../Context/userContext.jsx';
import ProfileInfoCard from '../components/ProfileInfoCard.jsx';
import Logo from "/logo.png";
import bg from "/Capture.png";

function Home() {
  const navigate = useNavigate();
  const { user, clearUser } = useUser();
  
  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("Login");

  const handleCTA = () => {
    if(!user){
      setOpenAuthModel(!openAuthModel);
    }else{
      navigate("/dashboard");
    }
  };


  return (
    <>
      <div className='w-full min-h-[500px] bg-[#FFFCEF] relative'>
        <div className='w-[500px] h-[400px] bg-amber-200/20 blur-[65px] absolute top-0 left-0'></div>

        <div className='container mx-auto px-10 pt-6 pb-[50px] relative z-10'>
          {/* Header */}
          <header className='flex justify-between items-center mb-10'>
            <div className='text-xl text-black font-bold'>
              <img src={Logo} alt="" className='h-15' />
            </div>
            {user ? 
            <ProfileInfoCard /> : 
            <button
              onClick={() => setOpenAuthModel(!openAuthModel)}
              className='bg-gradient-to-r from-[#FF9324] to-[#e99a4b] hover:bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:text-white border border-white transition-colors cursor-pointer'>
              Login / SignUp
            </button>}
          </header>

          {/* Hero Section */}
          <div className='flex flex-col md:flex-row items-center'>
            {/* Left Content */}
            <div className='w-full md:w-1/2 pr-4 mb-0'>
              <div className='flex items-center justify-start mb-2'>
                <div className='flex items-center gap-2 text-[13px] text-amber-600 font-bold bg-amber-100 px-3 py-1 rounded-full border border-amber-300'>
                  <LuSparkles /> AI Powered
                </div>
              </div>
              <h1 className='text-3xl md:text-5xl text-black font-medium mb-6 leading-tight'>
                Ace Interviews with <br />
                <span
                  className='text-transparent bg-clip-text font-semibold animate-text-shine'
                  style={{
                    backgroundImage: 'radial-gradient(circle, #FF9324 0%, #FCD760 100%)',
                    backgroundSize: '200% 200%',
                    backgroundPosition: '0% 50%',
                    display: 'inline-block',
                  }}
                >
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            {/* Right Content */}
            <div className='w-full md:w-1/2'>
              <p className='text-[17px] text-gray-900 mr-0 md:mr-20 mb-6'>
                Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize everything your way. From preparation to mastery — your ultimate interview toolkit is here.
              </p>
              <button
                onClick={handleCTA}
                className='bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer'>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full min-h-full relative z-10'>
        <div>
          <section className='flex items-center justify-center -mt-40'>
            <img className='w-[80vw] rounded-lg' src={bg} alt="" />
          </section>
        </div>
      </div>
      
      <div className='w-full min-h-full bg-[#FFFCEF] mt-10'>
        <div className='container mx-auto px-4 pt-10 pb-20'>
          <section className='mt-5'>
            <h2 className='text-2xl font-medium text-center mb-12'>Features That Make You Shine</h2>
            <div className='flex flex-col items-center gap-8'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full'>
                {
                  APP_FEATURES.slice(0,3).map((feature) => (
                    <div key={feature?.id} className='bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100'>
                      <h3 className='text-base font-semibold mb-3'>{feature?.title}</h3>
                      <p className='text-gray-600'>{feature?.description}</p>
                    </div>
                  ))
                }
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {
                  APP_FEATURES.slice(3).map((feature) => (
                    <div key={feature?.id} className='bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100'>
                      <h3 className='text-base font-semibold mb-3'>{feature?.title}</h3>
                      <p className='text-gray-600'>{feature?.description}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </section>
        </div>

        <div className='flex justify-center items-center gap-2 bg-gray-50 text-secondary text-center px-5 py-7'>Made with <FaHeart className='text-red-500'  /> <span className='font-bold'>M.Ahmed</span> </div>

      </div>

      <Modal isOpen={openAuthModel} onClose={() => {
        setOpenAuthModel(!openAuthModel);
        setCurrentPage("Login");
        // hideHeader
      }}>
        <div>
          {currentPage === "Login" && ( <Login setCurrentPage={setCurrentPage} /> )}
          {currentPage === "Signup" && ( <SignUp setCurrentPage={setCurrentPage} /> )}
        </div>
      </Modal>

    </>
  );
}

export default Home;