import { IoCloseCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import Input from './Input';
import axiosInstance from "../utils/axios";
import { API_PATH } from "../utils/apiPath";
import { useState } from "react";
import { useEffect } from "react";
import { useQuiz } from "../Context/quizContext";

function Sidebar({ isOpen, setIsOpen}) {
  const navigate = useNavigate();
  const[Progress, setProgress] = useState([]);
  const[topicName, setTopicName] = useState('');
  const[loader, setLoader] = useState(false);
  const { setQuizData } = useQuiz();

  const fetchProgress = async() => {
    try {
      const response = await axiosInstance.get(API_PATH.QUIZ.GET_RESULT);
      setProgress(response?.data?.data)
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
    }
  }

  useEffect(() => {
    fetchProgress();
  }, [])
  
  const handleStart = async() => {
    
    try {
      setLoader(true);
      const response = await axiosInstance.post(API_PATH.AI.GENARATE_QUIZ_Q, {topicName});
      setLoader(false)
      setIsOpen(false);
      navigate(`/quiz/${response?.data?.data?._id}`);
      setQuizData(response?.data?.data);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
    }
  }

  return (
      <div>
        <div className={`${isOpen ? 'fixed' : 'hidden'} top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform bg-orange-100 `}>
          <button
            onClick={() => setIsOpen(false)}
            className="text-black cursor-pointer  rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center ">
            <IoCloseCircleOutline size={20} />
          </button>

          <div className='pt-4'>
            <h1>Enter quiz</h1>
            <input onChange={(e) => setTopicName(e.target.value)} className="input-box" type="text" placeholder='Frontend Developer, Full Stack engineer ...' />
          </div>  

          <div className="py-4">
            <button
              onClick={handleStart}
              className="btn-primary">
              {loader ? <div className="w-7 h-7 border-4 border-t-primary border-gray-300 rounded-full animate-spin"></div>: <span>Start Quiz</span>}
            </button>
          </div>

          {Progress?.map((data) => (
            <div key={data?.userId} className="p-3 my-2 rounded-lg bg-orange-200 ">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-3">{data?.topicName} Quiz Progress</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-700 ">Your Score</p>
                <div className="w-full bg-gray-300 rounded-full h-3  mt-1">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(data?.Score / data?.questionLength) * 100}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Score: {data?.Score}/{data?.questionLength} | Status: Passed</p>
              </div>
             <div>
              {(() => {
                try {
                  // Get the first item and clean up the string
                  const raw = data?.suggestion?.[0];
                  if (!raw) return null;

                  const clean = raw.replace(/```/g, '').trim(); // remove any ``` blocks
                  const suggestions = JSON.parse(clean); // parse JSON string

                  return Array.isArray(suggestions) && suggestions.length > 0 ? (
                    <>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">
                        Suggestions to Improve
                      </h3>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {suggestions.map((sugg, ind) => (
                          <li key={ind}>{sugg}</li>
                        ))}
                      </ul>
                    </>
                  ) : null;
                } catch (err) {
                  console.error('Invalid suggestion format:', err);
                  return null; // or show fallback UI
                }
              })()}
            </div>

            </div>
          ))}
        </div>
      </div>
  );
}

export default Sidebar;