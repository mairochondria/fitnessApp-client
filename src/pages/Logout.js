import { Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import UserContext from "../context/UserContext";

export default function Logout() {
    // localStorage.clear();
    const {setUser, unsetUser} = useContext(UserContext);

    unsetUser();

    useEffect(() =>{
        setUser({
            id:null,
            isAdmin:null
        })
    })
    return(
        <Navigate to="/login"></Navigate>
    )
}