import React, { useReducer, createContext,useEffect } from 'react'
import App from '../App'
import Cookies from 'js-cookie'
import {reducer} from '../reducer/reducer'
export const ProjectContext = createContext()

let initialState = {
    authenticateUser:{
        name:'',
        nslId:"",
        role:""
    },
    notification:{
        message:"",
        code:""
    },
    isTeamLead:false,
    isAdmin:false,
    isUser:false,
    isLoggedIn:false,
    isLoading : false,
    projectId:"",
    projectInfo:{}
}
// const userData =JSON.parse(localStorage.getItem('userData'))
const jwt = Cookies.get("jwtooken")
// console.log(jwt);
const GlobalContext = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    // const [cookies, setCookie] = useCookies();
    const getUserData = async()=>{
        const res = await fetch(`${process.env.REACT_APP_URL}/protecteddata`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer "+ jwt
            }
        })
        const temp = await res.json()
        // console.log(temp);
        if (res.status === 200 && temp) {
            return dispatch({
                type:'CHECK_LOGIN',
                payload:temp
            })
        }
    }
    useEffect(() => {
        // Cookies.get("jwtooken")
        if(Cookies.get("jwtooken")){
            getUserData()
        }
        else{
            console.log("No Token");
        }
    }, [])

    const User = (data) =>{
        return dispatch({
            type:"USER",
            payload:data
        })
    }

    const setUpdateProject = (data)=>{
        return dispatch({
            type:"SAVE_INFO",
            payload:data
        })
    }
    const setProjetId =(data)=>{
        return dispatch({
            type:"UPDATE_ID",
            payload:data
        })
    }

    const setLoadingContext =()=>{
        return dispatch({
            type:"SETLOAD"
        
        })
    }

    const logoutUser =()=>{
        return dispatch({
            type:"LOGOUT"
        })
    }

    const setAlertData = (data) => {
        return dispatch({
            type: 'NOTIFICATION ADD',
            payload: data
        })
    }

    const clearAlertData = () => {
        return dispatch({
            type: 'NOTIFICATION CLEAR',
        })
    }

  return (
    <ProjectContext.Provider value={{...state, User, getUserData, logoutUser, setLoadingContext, setAlertData, clearAlertData,setProjetId,setUpdateProject}}>
        <App />
    </ProjectContext.Provider>
  )
}

export default GlobalContext