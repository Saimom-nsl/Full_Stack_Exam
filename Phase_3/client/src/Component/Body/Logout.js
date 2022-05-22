import React, {useContext,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectContext } from '../../Context/GlobalContext'
const Logout = () => {
    const {logoutUser} = useContext(ProjectContext)
    const navigate = useNavigate()
    useEffect(() => {
      logoutUser()
        navigate('/login')
    }, [])
    
  return (
    <div>Logout</div>
  )
}

export default Logout