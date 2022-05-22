import React,{useState,useContext} from 'react'
import { ProjectContext } from '../../../Context/GlobalContext'
const CreateUser = () => {
    const {setAlertData} = useContext(ProjectContext)
    const [user,setUser] = useState({
        name:"",nslId:"",password:"",cpassword:"",role:""
    })
    let name,value
    const eventHandle =(e)=>{
        name = e.target.name
        value = e.target.value
        setUser({...user,[name]:value})
    }

    const signUp =async(e)=>{
        e.preventDefault()
        const { name,nslId, password,cpassword,role } = user
        const res = await fetch(`${process.env.REACT_APP_URL}/userSignup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,nslId, password,cpassword,role
            })
        })
        const data = await res.json()
        if (res.status === 400) {
            console.log(data.message)
            setAlertData({message:data.message, code:"danger"})
        }
        else {
            setUser({
                nslId: "",
                password: "",
                name:"",
                cpassword:"",
                role:""
            })
            setAlertData({message: "User Created Succsessfully", code: "success"})
        }
    }
    return (
        <>
         {/* <Notification style={'loginArlat'}/> */}
        <div className="mt-5 container">
            
            <div className="signup-form">
                <div className="signup-content">
                    <div className="row">
                        <div className="col-md-6 login-box">
                            <h1 className="text-center">Create User</h1>
                            <form method="POST" >
                                <div className="form-group mt-5">
                                    <div className="input-group px-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <span className="fa fa-user"></span>
                                            </span>
                                        </div>
                                        <input type="text" className="form-control" name="name"
                                            value={user.name} onChange={eventHandle} placeholder="Username" required="required" />
                                    </div>

                                    <div className="input-group mt-3 px-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <span className="fa fa-paper-plane"></span>
                                            </span>
                                        </div>
                                        <input type="text" className="form-control" name="nslId"
                                            value={user.nslID} onChange={eventHandle} placeholder="NSL ID" required="required" />
                                    </div>

                                    <div className="input-group mt-3 px-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <span className="fa fa-lock"></span>
                                            </span>
                                        </div>
                                        <input type="password" className="form-control" name="password"
                                            value={user.password} onChange={eventHandle} placeholder="password" required="required" />
                                    </div>
                                    <div className="input-group mt-3 px-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <span className="fa fa-lock"></span>
                                            </span>
                                        </div>
                                        <input type="password" className="form-control" name="cpassword"
                                            value={user.cpassword} onChange={eventHandle} placeholder="confirm password" required="required" />
                                    </div>
                                    <div className="input-group mt-3 px-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <span className="fa fa-lock"></span>
                                            </span>
                                        </div>
                                        <input type="text" className="form-control" name="role"
                                            value={user.role} onChange={eventHandle} placeholder="Role must be admin,teamlead,user" required="required" />
                                    </div>
                                    <div className="form-group for-btn py-3">
                                        <input type="submit" name="signup" className="btn btn-primary btn-lg mt-3" value="register" onClick={signUp} />
                                    </div>
                                </div>
                            </form>

                        </div>

                    </div>
                </div>

            </div>
        </div>
        </>
       
    )
}

export default CreateUser