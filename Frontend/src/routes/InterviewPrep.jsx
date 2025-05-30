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

function InterviewPrep() {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explnation, setExplnation] = useState(null);
  const [isUpdatedLoader, setIsUpdatedLoader] = useState(false);

  const fetchDetailedSessionById = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.SESSION.GET_ONE(sessionId));
      if(response?.data && response?.data?.data){
        setSessionData(response?.data?.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const generateConceptExplanation = async (question) => {

  }

  const toggleQuestionPinStatus = async (question) => {
  }

  const uploadMoreQuestion = async () => {
  }

  useEffect(() => {
    if(sessionId){
      fetchDetailedSessionById()
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
                            onLearMore={() =>
                              generateConceptExplanation(data?.question)
                            }
                            isPinned = {data?.isPinned}
                            onTogglePin = {() => toggleQuestionPinStatus(data?._id)}
                          /> 
                      </>
                    </motion.div>
                  )
                })}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}

export default InterviewPrep