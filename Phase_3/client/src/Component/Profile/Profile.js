import React, { useState,useContext } from 'react'
import { Modal, Button} from "react-bootstrap";
import useToken from '../../Hooks/useToken'
import { ProjectContext } from '../../Context/GlobalContext';
const Profile = () => {
    const {setAlertData} = useContext(ProjectContext)
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [show, setShow] = useState(false);
    const [pass,setPass]=useState({
        password:"",cpassword:""
    })

    const jwt = useToken()
    const id = userData.data._id

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let name,value
    const changePassword =async (e) =>{
        const {password,cpassword} = pass
        e.preventDefault()
        const res = await fetch(`${process.env.REACT_APP_URL}/updatePassword/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization":`Bearer ${jwt}`
            },
            body: JSON.stringify({
                password,cpassword
            }),
        })
        const data = await res.json()
        if (res.status === 400){
            setAlertData({message:data.message, code:"danger"})
        } 
        else {
            setPass({
                password: "",
                cpassword: ""
            })
            setShow(false)
            setAlertData({message: "Password Changed Succsessfully", code: "success"})
            console.log(data.message);
        }
    }
    const eventHandle =(e)=>{
        name=e.target.name
        value = e.target.value
        setPass({...pass,[name]:value})
    }
    return (
        <>
            <div className='profile-head'>
                <div className='user-name' >
                    Name : {userData.data.name}
                </div>
                <div className='nsl-id' >
                    NSL ID : {userData.data.nslId}
                </div>
                <div className='role'>
                    Role : {userData.data.role}
                </div>
                <Button variant="primary" style={{marginTop:"20px"}} onClick={handleShow}>
                    Change Password
                </Button>
            </div>
            <Modal show={show}>
                <Modal.Header >
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="page">
                        <label className="field field_v1">
                            <input className="field__input" type="password" name='password' onChange={eventHandle} value={pass.password} />
                                <span className="field__label-wrap">
                                    <span className="field__label">Password</span>
                                </span>
                        </label>
                        <label className="field field_v2">
                            <input className="field__input" type="password" name='cpassword' onChange={eventHandle} value={pass.cpassword}/>
                                <span className="field__label-wrap">
                                    <span className="field__label">Confirm Password</span>
                                </span>
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={changePassword}>Change</Button>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                   
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default Profile