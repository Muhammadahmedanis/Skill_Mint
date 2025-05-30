// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './routes/Home'
import Login from './routes/Login'
import SignUp from './routes/SignUp'
import Dashboard  from './routes/Dashboard'
import InterviewPrep from './routes/InterviewPrep'
import { Toaster } from 'react-hot-toast'
import UserProvider from './Context/userContext'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={''}>
          <Route index element={ <Home/> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/signup' element={ <SignUp /> } />
          <Route path='/dashboard' element={ <Dashboard /> } />
          <Route path='interview-prep/:sessionId' element={ <InterviewPrep /> } />
          <Route />
        </Route>
      </>
    )
  )

  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </UserProvider>
    </>
  )
}

export default App
