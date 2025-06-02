import { IoCloseCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import Input from './Input';

function Sidebar({ isOpen, setIsOpen}) {
  const navigate = useNavigate();

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
            <Input placeholder='Frontend Developer, Full Stack engineer ...' />
          </div>  

          <div className="py-4">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/quiz');
              }}
              className="btn-primary">
              <span>Start Quiz</span>
            </button>
          </div>

          {[1, 2].map((i) => (
            <div key={i} className="p-3 my-2 rounded-lg bg-orange-200 ">
              <h2 className="text-[17px] font-semibold text-gray-900 mb-3">JavaScript Quiz Progress</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-700 ">Your Score</p>
                <div className="w-full bg-gray-300 rounded-full h-3  mt-1">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Score: 7/10 | Status: Passed</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800  mb-1">Suggestions to Improve</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Review array methods like <code>.map()</code>, <code>.filter()</code>.</li>
                  <li>Practice closures and scope in functions.</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}

export default Sidebar;