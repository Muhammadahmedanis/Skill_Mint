import axiosInstance from '../utils/axios.js';

export const API_PATH = {
    AUTH: {
        LOGIN: "/auth/login",
        SIGNUP: "/auth/signup",
        GET_PROFILE: "/auth/getProfile",
    },
    AI: {
        GENERATE_QUESTIONS: "/ai/generate-questions",
        GENERATE_EXPLANATION: "/ai/generate-explanation",
    },
    SESSION: {
        CREATE: "/session/create",
        GET_ALL: "/session/my-sessions",
        GET_ONE: (id) => `/session/${id}`,
        DELETE: (id) => `/session/${id}`
    },
    QUESTION: {
        ADD_TO_SESSION: "/question/add",
        PIN: (id) => `/question/${id}/pin`,
        UPDATE_NOTE: (id) => `question/note/${id}`
    }
}