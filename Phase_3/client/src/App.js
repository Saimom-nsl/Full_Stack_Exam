import React from 'react'
import { Routes, Route } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/style.css'
import Login from './Component/Body/Login/Login'
import Logout from './Component/Body/Logout'
import ProtectedRouter from './Component/Protected Router/ProtectedRouter'
import User from './Component/Body/User Page/User'
import Navbar from './Component/Header/Navbar'
import Profile from './Component/Profile/Profile'
import CreateUser from './Component/Body/User Page/CreateUser'
import CreateProject from './Component/Body/User Page/CreateProject'
import ProjectShow from './Component/Project Show/ProjectShow'
import UpdateProject from './Component/Project Show/UpdateProject'
import Notification from './Component/AlertNotification/Notification'
const App = () => {
  return (
    <div>
      <Navbar />
      <Notification/>
      <Routes>
        <Route path="/" element={<ProtectedRouter><User /></ProtectedRouter>} />
        <Route path="/login" exact element={<Login />} />
        <Route path='/logout' element={<ProtectedRouter><Logout /></ ProtectedRouter>} />
        <Route path='/profile' element={<ProtectedRouter><Profile /></ ProtectedRouter>} />
        <Route path='/createuser' element={<ProtectedRouter><CreateUser /></ ProtectedRouter>} />
        <Route path='/createproject' element={<ProtectedRouter><CreateProject /></ ProtectedRouter>} />
        <Route path='/showproject' element={<ProtectedRouter><ProjectShow /></ ProtectedRouter>} />
        <Route path='/updateproject' element={<ProtectedRouter><UpdateProject /></ ProtectedRouter>} />
      </Routes>
    </div>
  )
}

export default App
