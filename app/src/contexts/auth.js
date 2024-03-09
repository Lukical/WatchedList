import { useState, createContext, useEffect } from "react";
import api from "../services/api"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(()=>{
        async function loadUser(){
            const storageUser = await localStorage.getItem("@authDataWL")
            if(storageUser){
                const getData = JSON.parse(storageUser)
                api.defaults.headers['Authorization'] = `Bearer ${getData.token}`
                setUser({
                    nome: getData.nome,
                    email: getData.email,
                    user_name: getData.user_name,
                    avatarUrl: getData.avatarUrl,
                    member: getData.member,
                    token: getData.token
                })
                setLoading(false)
            }
            setLoading(false)
        }
        loadUser();
    },[])

    async function signIn(email, password){
        setLoadingAuth(true)
        try {
            const response = await api.post("/auth",{
                email: email,
                password: password
            })
            const {user, token} = response.data
            api.defaults.headers['Authorization'] = `Bearer ${token}`
            let data = {
                nome: user.name,
                email: user.email,
                user_name: user.user_name,
                avatarUrl: user.avatar,
                member: user.member,
                token: token
            }
            setUser(data)
            setLoadingAuth(false);
            storageUser(data)
            toast.success("Bem-vindo de volta!");
            navigate("/home");
        } catch (error) {
            toast.error(error.response.data.error)
        }
        setLoadingAuth(false) 
    }

    async function signUp(email, password, name, user_name){
        setLoadingAuth(true)
        try {
            const response = await api.post("/user",{
                name: name,
                user_name: user_name,
                email: email,
                password: password
            })
            setLoadingAuth(false)
            toast.success("Cadastrado com sucesso!")
            navigate("/")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        setLoadingAuth(false)
    }
    function storageUser(data){
        localStorage.setItem("@authDataWL", JSON.stringify(data))
    }
    async function logout(){
        localStorage.removeItem("@authDataWL");
        api.defaults.headers['Authorization'] = ""
        setUser(null);
    }

    return(
        <AuthContext.Provider 
            value={{
                signed: user ? true : false,
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading,
                storageUser,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;