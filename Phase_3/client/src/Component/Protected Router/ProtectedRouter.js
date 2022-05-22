import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRouter = ({children}) => {
    const user = localStorage.getItem("userData")
    if(user){
        return children
    }
    else {
        return <Navigate to={"/login"}/>
    }
 
}

export default ProtectedRouter