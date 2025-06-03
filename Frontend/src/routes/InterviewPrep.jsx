import React, { useEffect, useState } from 'react'
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion"
import { LuCircleAlert, LuListCollapse } from 'react-icons/lu'
import { useParams } from 'react-router-dom';
import DashboardLayout from '../Layout/DashboardLayout';
import RoleInfoHeader from '../components/RoleInfoHeader';
import axiosInstance from '../utils/axios';
import { API_PATH } from '../utils/apiPath';
import QuestionCard from '../components/QuestionCard';
import toast from 'react-hot-toast';
import AIResponsePreview from '../components/AIResponsePreview';
import Drawer from '../components/Drawer';
import SkeletonLoader from '../components/SkeletonLoader';

function InterviewPrep() {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isUpdatedLoader, setIsUpdatedLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchSessionDetailedById = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.SESSION.GET_ONE(sessionId));
      if(response?.data && response?.data?.data){
        setSessionData(response?.data?.data)
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);
      
      const response = await axiosInstance.post(API_PATH.AI.GENERATE_EXPLANATION, {question} );
      if(response.data?.data){
        setExplanation(response.data?.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation, Try again later");
      console.error("Error: ", error);
    } finally{
      setIsLoading(false);
    }
  };



  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.put(API_PATH.QUESTION.PIN(questionId));
      console.log(response?.data);
      if(response?.data && response.data?.data.question){
        // toast.success("Question Pinned Successfully");
        fetchSessionDetailedById();
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };



  const uploadMoreQuestion = async () => {
    try {
      setIsUpdatedLoader(true);

      const aiResponse = await axiosInstance.post(API_PATH.AI.GENERATE_QUESTIONS, 
        { role: sessionData?.role, experience: sessionData?.experience, topicsToFocus: sessionData?.topicsToFocus, numberOfQuestions: 10 } 
      )

      const generatedQuestions = aiResponse?.data?.data;
      console.log(generatedQuestions);
      
      const response = await axiosInstance.post(API_PATH.QUESTION.ADD_TO_SESSION, {
        sessionId, questions: generatedQuestions,
      });

      if(response?.data?.data){
        toast.success("Add More Q&A!!");
        fetchSessionDetailedById();
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went woring!");
    }finally{
      setIsUpdatedLoader(false);
    }
  };


  useEffect(() => {
    if(sessionId){
      fetchSessionDetailedById();
    }

    return () => {}
  }, [])

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""} 
        topicsToFocus={sessionData?.topicsToFocus || ""} 
        experience={sessionData?.experience || "" } 
        questions={sessionData?.questions.length || "-"} 
        description={sessionData?.description || ""} 
        lastUpdated={
          sessionData?.updatedAt ? moment(sessionData?.updatedAt).format("Do MMM YYYY")
          : ""
        }
      />

      <div className='w-full max-w-7xl mx-auto pt-4 px-4 md:px-0'>
        <h2 className='text-lg font-semibold text-black'>Interview Q & A</h2>
        <div className='grid grid-cols-12 gap-4 mt-5 mb-10 '>
          <div className={`col-span-12 ${openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"}`}>
            <AnimatePresence>
              {
                sessionData?.questions?.map((data, ind) => {
                  return (
                    <motion.div key={data?._id || ind} initial={{ opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} exit={{ opacity: 0, scale: 0.95}} transition={{ duration: 0.4, type: "spring", stiffness: 100, delay: ind * 0.1, damping: 15, }} 
                    layout
                    layoutId={`question-${data?._id || ind}`}>
                      <>
                        <QuestionCard
                            question={data?.question}
                            answer={data?.answer}
                            onLearnMore={() =>
                              generateConceptExplanation(data?.question)
                            }
                            isPinned = {data?.isPinned}
                            onTogglePin = {() => toggleQuestionPinStatus(data?._id)}
                          /> 
                      </>
                      {!isLoading && sessionData?.questions?.length === ind + 1 && (
                        <div className='flex items-center justify-center mt-5'>
                          <button className='flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer' disabled={isLoading || isUpdatedLoader} onClick={uploadMoreQuestion}>
                            {isUpdatedLoader ? (<div className="w-7 h-7 border-4 border-t-primary border-gray-300 rounded-full animate-spin"></div>) : <LuListCollapse className='text-lg' /> }
                            Load More
                          </button>
                        </div>
                      ) }
                    </motion.div>
                  )
                })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div>
        <Drawer
          isOpen={openLearnMoreDrawer}
          onClose={() => setOpenLearnMoreDrawer(!openLearnMoreDrawer)}
          title={!isLoading && explanation?.title}>
          { errorMsg && ( <p className='flex gap-2 text-sm text-amber-600 font-medium'> <LuCircleAlert className='mt-1' />{errorMsg}</p> )}
          {isLoading && <SkeletonLoader />}
          {!isLoading && explanation && ( <AIResponsePreview content={explanation?.explanation} /> ) }
        </Drawer>
      </div>

    </DashboardLayout>
  )
}

export default InterviewPrep