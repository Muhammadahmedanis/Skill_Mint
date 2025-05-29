export const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => (`
    You are an AI trained to generate technical interview questions ans answer.
    Task:
    - Role: ${role}
    - Candidate Experience: ${experience} years
    - Focus Topics: ${topicsToFocus}
    - Generate ${numberOfQuestions} interview questions.
    - For wach question, genrate a detailed but beginner-friendly answer.
    - If the answer needs a code example, and a small code block inside.
    - Keep formatting clean.
    - Return a pure JSON array like:
    [
        {
            "question": "Your question here",
            "answer": "Answer with markdown formatting here"
        }
    ]

    Important: Do not add extra text or explanations. Just return valid JSON.
    `
)

export const conceptExplainPrompt = (question) => ( `
    You are an AI trained to generate explnation for a given interview question.
    Task: 
    
    - Explain the following interview question and its concept depth as if you'are teching a beignner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the explanation includes a code example, provide a small code block.
    - Keep the formatting very clean and clear.
    - Return the result as a valid JSON Object in the following format:
    
    {
        "title": "Short title here?",
        "explanation": "Explanation here.",
    } 
    
    Important: Do not add any extra text outside the JSON format. Only return valid JSON.
    `
)