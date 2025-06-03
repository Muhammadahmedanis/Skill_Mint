import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const QuizContext = createContext();

const QuizProvider = ({ children }) => {
    const[quizData, setQuizData] = useState(null);
    return(
        <QuizContext.Provider value={{ quizData, setQuizData }}>
            { children }
        </QuizContext.Provider>
    )
}

export default QuizProvider;
export const useQuiz = () => useContext(QuizContext);