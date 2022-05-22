import Cookies from "js-cookie";
export default function useToken (){
    const jwt = Cookies.get("jwtooken")
    return jwt
}