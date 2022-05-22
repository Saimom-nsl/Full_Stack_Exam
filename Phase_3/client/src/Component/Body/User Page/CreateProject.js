import React, { useState, useEffect,useContext } from 'react'
import useToken from '../../../Hooks/useToken'
import { ProjectContext } from '../../../Context/GlobalContext'
const CreateProject = () => {
    const {setAlertData} = useContext(ProjectContext)
    const [reportData, setReportData] = useState({
        title: "", startDate: "", endDate: "", description: "", teamLead: "", members:""
    })
    const jwt = useToken()
    const [teamLead, setTeamLead] = useState([])
    const [teamMember,setTeamMember] = useState([])
    let name, value;
    const eventHandle = (e) => {
        name = e.target.name
        value = e.target.value
        console.log(value);
        setReportData({ ...reportData, [name]: value })
    }

    const createProject =async (e) => {
        e.preventDefault()
        const { title,startDate,endDate,description,teamLead,members } = reportData
        console.log(reportData);
        const res = await fetch(`${process.env.REACT_APP_URL}/createproject`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization":`Bearer ${jwt}`
            },
            body: JSON.stringify({
                title,startDate,endDate,description,teamLead,members
            }),
        })
        const data = await res.json()
        if (res.status === 400) {
            console.log(data.message)
            setAlertData({message:data.message, code:"danger"})
        }
        else {
            setReportData({
                title: "", startDate: "", endDate: "", description: "", teamLead: "",members:""
            }) 
            setAlertData({message: "Project Created Succsessfully", code: "success"})
        }
    }
    const getTeamLead = async () => {
        const res = await fetch(`${process.env.REACT_APP_URL}/getUser?status=teamlead`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        })
        const data = await res.json()
        if (res.status === 400) console.log(data.message)
        else {
            setTeamLead(data)
        }
    }

    const getTeamMeamber = async()=>{
        const res = await fetch(`${process.env.REACT_APP_URL}/getUser?status=user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        })
        const data = await res.json()
        if (res.status === 400) console.log(data.message)
        else {
            setTeamMember(data)
        }
    }

    useEffect(() => {
        getTeamLead()
        getTeamMeamber()
    }, [])


    return (
        <div className="mt-5 container">
            <div className="signup-form">
                <div className="signup-content">
                    <div className="row">
                        <div className="col-md-6 login-box">
                            <h1 className="text-center">Create Project</h1>
                            <form method="POST" >
                                <div className="form-group mt-5">
                                    <div className="input-group px-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <span className="fa fa-user"></span>
                                            </span>
                                        </div>
                                        <input type="text" className="form-control" name="title"
                                            value={reportData.title} onChange={eventHandle} placeholder="Project Title" required="required" />
                                    </div>

                                    <div className="input-group mt-3 px-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                            <i className="fa fa-solid fa-calendar"></i>
                                            </span>
                                        </div>
                                        <input type="date" className="form-control" name="startDate"
                                            value={reportData.startDate} onChange={eventHandle} placeholder="NSL ID" required="required" />
                                    </div>

                                    <div className="input-group mt-3 px-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                            <i className="fa fa-solid fa-calendar"></i>
                                            </span>
                                        </div>
                                        <input type="date" className="form-control" name="endDate"
                                            value={reportData.endDate} onChange={eventHandle} placeholder="password" required="required" />
                                    </div>
                                    <div className="input-group mt-3 px-3">
                                        <div className="input-group-prepend">
                                            {/* <span className="input-group-text">
                                                <span className="fa fa-lock"></span>
                                            </span> */}
                                        </div>

                                        <select class="form-select form-select-lg mb-3" aria-label=".form-select-sm example"  name="teamLead" onChange={eventHandle}>
                                            <option selected disabled>Select Team Leader</option>
                                            {
                                               teamLead && teamLead.map((val) => {
                                                   
                                                    return (
                                                        <option value={val._id} name="teamLead" >{val.name}</option>
                                                    )

                                                })
                                            }

                                        </select>


                                        <select class="form-select form-select-lg mb-3" aria-label=".form-select-sm example" name="members" onChange={eventHandle}>
                                            <option selected disabled>Select Team Member</option>
                                            {
                                               teamMember && teamMember.map((val) => {
                                                    return (
                                                        <option value={val._id} name="members" >{val.name}</option>
                                                    )

                                                })
                                            }

                                        </select>
                                    </div>
                                    <div className="input-group mt-3 px-3">
                                        <div className="input-group-prepend">
                                            {/* <span className="input-group-text">
                                                <span className="fa fa-paper-plane"></span>
                                            </span> */}
                                        </div>
                                        <textarea type="text" className="form-control" name="description"
                                            value={reportData.description} onChange={eventHandle} placeholder="Description" required="required" />
                                    </div>
                                        <div className="form-group for-btn py-3">
                                            <input type="submit" name="signup" className="btn btn-primary btn-lg mt-3" value=" Create" onClick={createProject} />
                                        </div>
                                    </div>
                            </form>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default CreateProject