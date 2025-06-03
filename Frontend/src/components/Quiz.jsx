import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CiCircleCheck } from 'react-icons/ci';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '../Context/quizContext';
import axiosInstance from '../utils/axios';
import { API_PATH } from '../utils/apiPath';

const Quiz = () => {
  const { quizData } = useQuiz()
  // console.log(quizData);
  const quiz = quizData?.quizQ || []; 
  const totalQuestions = quiz.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const[timeLeft, setTimeLeft] = useState(900);
  const navigate = useNavigate();
  const{ quizId } = useParams();

  

  useEffect(() => {
  if(timeLeft <= 0){
      toast.error('Time is up! Quiz auto-submitted.');
      return;
  }

  const timer = setInterval(() => {
        setTimeLeft(prev => prev-1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, navigate])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = async() => {
    if(selectedOption != null){
      setSelectedAnswers(prev => [...prev, selectedOption]);
    }

    if(currentQuestion < totalQuestions -1){
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
    }
  };


  const handleSubmit = async () => {
  if (selectedOption !== null) {
    const updatedAnswers = [...selectedAnswers, selectedOption]; // include the last answer
      try {
        const response = await axiosInstance.post(API_PATH.AI.GENERATE_RESULTSUGGESTION, {
          quizId,
          selectedAnswers: updatedAnswers,
        });
        toast.success("Quiz completed");
        setTimeLeft(900);
        navigate("/dashboard");
      } catch (err) {
        toast.error("Something went wrong while submitting!");
      }
    }
  };




  return (
    <div className='bg-gradient-to-r from-[#FF9324] to-[#e99a4b] min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md p-6 rounded-xl bg-white shadow-2xl relative'>
        <div className="absolute top-4 right-4 bg-[#FF9324] text-white px-4 py-1 rounded-md font-semibold text-sm shadow-md">
        {formatTime(timeLeft)}
        </div>

        <h1 className="text-center text-md font-bold text-[#FF9324] mb-6">
        {quizData?.topicName} Mock Interview
        </h1>

        <div className="w-full bg-gray-200 h-3 rounded-full mb-6 overflow-hidden">
        <div
            className="bg-[#FF9324] h-3 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        ></div>
        </div>

        <div className='border-4 border-[#FF9324] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6'>
          <span className='font-bold text-2xl text-[#FF9324]'>{currentQuestion + 1}</span>
        </div>

        <div className='text-center mb-8'>
          <span className='font-bold text-lg'>
            {quiz[currentQuestion]?.question}
          </span>
        </div>

        <div className='space-y-4 mb-6'>
          {quiz[currentQuestion]?.options?.map((option, idx) => (
            <div
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`rounded-2xl flex items-center justify-between gap-3 p-4 cursor-pointer border transition-all duration-200
                ${selectedOption === option ? 'bg-[#FF9324] text-white border-[#e87d0d]' : 'bg-white text-black border-gray-200'}
              `}>
              <span className='font-medium text-sm'>{option}</span>
              <CiCircleCheck size={20} />
            </div>
          ))}
        </div>
        <button
          onClick={currentQuestion === totalQuestions - 1 ? handleSubmit : handleNext}
          disabled={selectedOption === null}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200
            ${selectedOption === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FF9324] cursor-pointer text-white hover:bg-[#e87d0d]'}
          `}>
          {currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
