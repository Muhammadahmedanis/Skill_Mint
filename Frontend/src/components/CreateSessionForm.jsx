import { useActionState } from 'react'
import { useActionData, useNavigate } from 'react-router-dom'
import { FaRegEnvelope, FaRegEyeSlash, FaRegUser } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import Input from '../components/Input';
import Label from '../components/Label';
import axiosInstance from '../utils/axios';
import { API_PATH } from '../utils/apiPath';

function CreateSessionForm() {
    const navigate = useNavigate();
const [actionState, submitAction, isPending] = useActionState(async (_prevState, formData) => {
  const role = formData.get("role");
  const experience = formData.get("experience");
  const topicsToFocus = formData.get("topicsToFocus");
  const description = formData.get("description");

  if (!role || !topicsToFocus || !experience || !description) {
    return { error: "All fields are required." };
  }

  try {
    const payload = {
      role,
      experience,
      topicsToFocus,
      description,
      numberOfQuestions: 10,
    };

    const aiResponse = await axiosInstance.post(API_PATH.AI.GENERATE_QUESTIONS, payload);
    const generatedQuestions = aiResponse?.data?.data;
    // console.log(generatedQuestions);
    
    const sessionPayload = {
      role,
      experience,
      topicsToFocus,
      description,
      questions: generatedQuestions,
    };

    const response = await axiosInstance.post(API_PATH.SESSION.CREATE, sessionPayload);
    console.log(response?.data?.data?._id);
    
    if (response?.data?.data?._id) {
      navigate(`/interview-prep/${response?.data?.data?._id}`);
    }
  } catch (error) {
    return {
      error: error?.response?.data?.message || "Something went wrong. Please try again.",
    };
  }
}, null);


  return (
    <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center'>
        <h3 className='text-lg font-semibold text-black'>Start a new Interview Journey</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-3'>Fill out a few quick details and unlock your personalized set of interview qiestions!</p>
           <form action={submitAction} className='flex flex-col gap-3'>

            <div className=''>
              <Label htmlFor="role" labelName="Target Role" />
              <div className="relative flex items-center">
                <Input type="text" name="role" placeholder="(e.g., Frontend Developer, UI/UX, Designer, etc.)"  />
              </div>
            </div>

            <div className=''>
              <Label htmlFor="experience" labelName="Years of Experience" />
              <div className="relative flex items-center">
                <Input type="number" name="experience" placeholder="(e.g., 1 year, 3 years, 5+ years)" />
              </div>
            </div>

            <div className=''>
              <Label htmlFor="topicsFoucs" labelName="Topics to Focus On" />
              <div className="relative flex items-center">
                <Input type="text" name="topicsToFocus" placeholder="(Comma separated, e.g., React, Node.js , MongoDB)" />
              </div>
            </div>

            <div className=''>
              <Label htmlFor="description" labelName="Description" />
              <div className="relative flex items-center">
                <Input type="text" name="description" placeholder="(Any spaecfic goals or notes for this session)" />
              </div>
            </div>
            {actionState?.error && (
                <p className='text-red-600 text-sm mt-1 -mb-2'>{actionState?.error}</p>
            )}

            <button
              type='submit'
              disabled={isPending}
              className="btn-primary">
              { isPending ? <div className="w-7 h-7 border-4 border-t-primary border-gray-300 rounded-full animate-spin"></div> : <div className='text-[17px] font-semibold'>Create Session</div>} 
            </button>
            </form>
    </div>
  )
}

export default CreateSessionForm