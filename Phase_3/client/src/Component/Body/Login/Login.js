import React, { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectContext } from '../../../Context/GlobalContext'
import Loader from '../../Loader/Loader'
import Notification from '../../AlertNotification/Notification'
const Login = () => {

    const { getUserData,setAlertData,setLoadingContext } = useContext(ProjectContext)
    const [loading,setLoading] =useState(false)
    const navigate = useNavigate()
    const [user, setUser] = useState({
        nslId: "", password: ""
    })
    let name, value;
    const eventHandle = (e) => {
        name = e.target.name
        value = e.target.value
        setUser({ ...user, [name]: value })
    }
    const loginUser = async (e) => {
        setLoading(true)
        e.preventDefault()
        const { nslId, password } = user
        const res = await fetch(`${process.env.REACT_APP_URL}/userSignin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nslId, password
            }),
            credentials: 'include'
        })
        const data = await res.json()
        if (res.status === 400) {
            console.log(data.message)
            setAlertData({message:data.message, code:"danger"})
            setLoading(false)
        }
        else {
            setUser({
                nslId: "",
                password: ""
            })
            localStorage.setItem("userData", JSON.stringify(data))
            navigate('/')
            getUserData()
            setAlertData({message: "Login Successfully", code: "success"})
            setLoading(false)
            setLoadingContext()
            
        }
    }

    return (
        <>
        {
            loading ? <Loader/> :
            <div className="mt-5 container">
            
            <div className="login-form">
                <div className="login-content">
                    <div className="row">
                        <div className="col-md-6 login-box">
                            <h1 className="text-center mt-3">Log In</h1>
                            <form method="POST">
                                <div className="form-group mt-5">
                                    <div className="input-group mt-3 px-5">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <span className="fa fa-paper-plane"></span>
                                            </span>
                                        </div>
                                        <input type="email" className="form-control" name="nslId" value={user.nslId} onChange={eventHandle} placeholder="NSL ID" required="required" />
                                    </div>


                                    <div className="input-group mt-3 px-5">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <span className="fa fa-lock"></span>
                                            </span>
                                        </div>
                                        <input type="password" className="form-control" name="password" value={user.password} onChange={eventHandle} placeholder="password" required="required" />
                                    </div>

                                    <div className="form-group for-btn py-5">
                                        <button type="submit" onClick={loginUser} className="btn btn-primary btn-lg mt-3">Sign In</button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

            </div>

        </div>
            
        }
     
        </>
          

    )
}

export default Login