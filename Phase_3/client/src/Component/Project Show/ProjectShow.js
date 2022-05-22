import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '../../Hooks/useToken'
import jwt_decode from "jwt-decode";
import edit from '../../images/edit.svg'
import deletes from '../../images/delete.svg'
import download from '../../images/download.svg'
import Cookies from 'js-cookie'
import { ProjectContext } from '../../Context/GlobalContext'
import { saveAs } from "file-saver";
import Loader from '../Loader/Loader'
const ProjectShow = () => {

    const token = Cookies.get('jwtooken')
    var decodeToken
    if(token){
         decodeToken = jwt_decode(token)
    }
    const jwt = useToken()
    const userData = JSON.parse(localStorage.getItem('userData'))
    // console.log("dasdasdasdasdasdas",userData.data.name);
    const navigate = useNavigate()
    const { setProjetId, setUpdateProject,setAlertData,isAdmin,isTeamLead } = useContext(ProjectContext)
    const [project, setProject] = useState([])
    const [loading, setLoading] = useState(false)
    const [paper, setPaper] = useState("")
    const [url, setUrl] = useState("")
    const [track,setTrack] =useState(false)
    const [reportData, setReportData] = useState({
        title: ""
    })
    const [showPaper,setShowPaper] = useState([])
    let name, value
    const eventHandle = (e) => {
        name = e.target.name
        value = e.target.value
        setReportData({ ...reportData, [name]: value })
    }
    const getProjects = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_URL}/getproject`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        })
        const data = await res.json()
        if (res.status === 400) console.log(data.message)
        else {
            setProject(data)
            setLoading(false)
            // console.log(data);
        }
    }

    const uploadImage = (e) => {

        setPaper(e.target.files[0]);
        console.log(paper);
    }

    const uploadPaper = () => {
        const data = new FormData()
        data.append("file", paper)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "saimomcloud")
        console.log(data);
        fetch("https://api.cloudinary.com/v1_1/saimomcloud/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
                // console.log(data)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const updateProject = (id, val) => {
        console.log(val);
        setProjetId(id)
        setUpdateProject(val)
        console.log("entered");
        navigate('/updateproject')
    }

    const deleteProject = async (id) => {
        const res = await fetch(`${process.env.REACT_APP_URL}/deleteproject/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        })
        const data = await res.json()
        if (res.status === 400){
            setAlertData({message:data.message, code:"danger"})

        } 
        else {
            setProject(project.filter(i => i._id !== id))
            console.log(project);
            setAlertData({message: "Project Deleted Succsessfully", code: "success"})
        }
    }

    const deletePaper =async(id)=>{
        const res = await fetch(`${process.env.REACT_APP_URL}/deletepaper/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        })
        const data = await res.json()
        if (res.status === 400){
            setAlertData({message:data.message, code:"danger"})
        } 
        else {
            setShowPaper(showPaper.filter(i => i._id !== id))
            setAlertData({message:"Paper deleted Successfully", code:"success"})
            console.log(paper);
        }
    }

    const getPaper =async()=>{
        const res = await fetch(`${process.env.REACT_APP_URL}/getpaper`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        })
        const data = await res.json()
        if (res.status === 400) console.log(data.message)
        else {
            setShowPaper(data)
        }
    }

    const saveFile =(val)=>{
        saveAs(
            val
          );
    }

    useEffect(() => {
        if (url) {
            // const { title, body } = post
            //     console.log(url);
            // setLoading(true)
            console.log("UseEffect",userData.data.name);
            const { title } = reportData
            fetch(`${process.env.REACT_APP_URL}/uploadpaper`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt
                },
                body: JSON.stringify({
                    paperLink: url,
                    title,
                    contributerName:userData.data.name
                })
            })
                .then((res) => res.json())
                .then(data => {console.log(data)
                setTrack(!track)
                
            setAlertData({message: "Paper Uploaded Succsessfully", code: "success"})
            })
                .catch(err => { console.log(err);
                    setAlertData({message:err, code:"danger"}) })
        }
    }, [url])

    useEffect(() => {
        getProjects()
        getPaper()
    }, [track])
    return (
        <>
            {
                loading ? <Loader /> :
                    <div>
                        <h3 className='text-center mb-5'>Project List</h3>
                        <table class="table mb-5">
                            <thead>
                                <tr>
                                    <th scope="col">Title</th>
                                    <th scope="col">Start Date</th>
                                    <th scope="col">End Date</th>
                                    <th scope="col">Team Leader</th>
                                    <th scope="col">Team Member</th>
                                    {
                                        (decodeToken.role ==='admin' || decodeToken.role==='teamlead')&&<th scope="col">Action</th>
                                    }
                                    
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    project && project.map((val) => {
                                        // console.log(val);
                                        return (
                                            <tr>
                                                <th scope="row">{val.title}</th>
                                                <td>{val.startDate.split('T')[0]}</td>
                                                <td>{val.startDate.split('T')[0]}</td>
                                                <td>{val.teamLead.name}</td>
                                                <td>{val.members.name}</td>
                                                {
                                                    (decodeToken.role ==='admin' || decodeToken.role==='teamlead') && <td>
                                                    <img src={edit} style={{ height: "30px" }} onClick={() => updateProject(val._id, val)} />
                                                    <span className='mx-3'></span>
                                                    <img src={deletes} style={{ height: "30px" }} onClick={() => deleteProject(val._id)} />
                                                </td>
                                                }
                                               

                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>


                        <div className='file-upload-div' style={{ width: "100vw" }}>

                            <h3 className='mb-5'>Pdf Paper upload</h3>

                            <input type="file" accept="application/pdf" name="paper" id="file"
                                style={{ display: 'none', }} onChange={uploadImage} />
                            <label htmlFor="file" >
                                <i className="material-icons" style={{ marginRight: "5px", }}>
                                    add_photo_alternate
                                </i>
                                Upload PDF </label>

                            <input type="text" className="form-control" name="title" style={{ width: "250px",marginTop: "20px" }}
                                value={reportData.title} onChange={eventHandle} placeholder="Paper Title" required="required" />

                            <button className='btn btn-primary' onClick={uploadPaper} style={{ width: "250px", marginBottom: "50px", marginTop: "20px" }}>Submit</button>
                        </div>



                        <h3 className='text-center mb-3'>Paper List</h3>
                        <table class="table mb-5">
                            <thead>
                                <tr>
                                    <th scope="col">SL No</th>
                                    <th scope="col">Title</th>
                                    {
                                        (decodeToken.role ==='admin' || decodeToken.role==='teamlead')&&<th scope="col">Action</th>
                                    }
                                    
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    showPaper && showPaper.map((val,i) => {

                                        return (
                                            <tr>
                                                <th scope="row">{i+1}</th>
                                                <td><a href={val.paperLink} onClick={()=>saveFile(val.paperLink)} target='blank'>{val.title}</a></td>

                                                {
                                                   (decodeToken.role ==='admin' || decodeToken.role==='teamlead')&& <td>
                                                    
                                                    <img src={deletes} style={{ height: "30px" }} onClick={() => deletePaper(val._id)} />
                                                </td>
                                                }
                                               
                                               
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>


                    </div>
            }
        </>

    )
}

export default ProjectShow