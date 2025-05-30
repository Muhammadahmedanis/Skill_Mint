import React from 'react'
import { useUser } from '../Context/userContext'
import Navbar from './Navbar';

function DashboardLayout({ children }) {
    const{ user } = useUser();
  return (
    <div>
        <Navbar />
        { user && <div>{children}</div> }
    </div>
  )
}

export default DashboardLayout