import Cookies from 'js-cookie'
export const reducer =(state,action) => {
    switch(action.type){
        case 'CHECK_LOGIN':
            state.isLoggedIn = true
            state.authenticateUser.name = action.payload.data.name
            state.authenticateUser.nslId = action.payload.data.nslId
            state.authenticateUser.role = action.payload.data.role
            if(action.payload.data.role==='admin'){
                state.isAdmin = true
            }
            if(action.payload.data.role==='teamlead'){
                state.isTeamLead = true
            }
            if(action.payload.data.role==='user'){
                state.isUser = true
            }
            return{...state}
        case 'SETLOAD':
            state.isLoading = true
            return {...state}
        case 'UPDATE_ID':
            state.projectId=action.payload
            return {...state}
        case 'SAVE_INFO':
            state.projectInfo = action.payload
            return {...state}
        case 'LOGOUT':
            Cookies.remove('jwtooken')
            localStorage.removeItem('userData')
            state.isLoggedIn = false
            state.authenticateUser.name = ''
            state.authenticateUser.nslId = ''
            state.authenticateUser.role = ''
            state.isAdmin = false
            state.isTeamLead =false
            state.isUser = false
            return {...state}
        case 'NOTIFICATION ADD':
                state.notification.message = action.payload.message
                state.notification.code = action.payload.code 
                return {...state, message:action.payload.message, code:action.payload.code}
            
        case 'NOTIFICATION CLEAR':
                state.notification.message = ""
                state.notification.code = ""
                return {...state, message:"", code:""}
        default:
            return {...state}
    }
}