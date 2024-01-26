import { useContext } from "react"
import avatarImg from "../../assets/avatar.png"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"
import "./header.css"

export default function Header(){
    const { user, logout } = useContext(AuthContext)
    async function handleLogout(){
        await logout();
    }
    return(
        <div className="headerbar">
            <div className="navbar">
                <div className="logo">WatchedList</div>
                <div className="links">
                    <Link to="/home">Home</Link>
                    <Link to="/profile">Perfil</Link>
                    <Link to={`/user/${user.user_name}`}>Minha lista</Link>
                    <Link to="/social">Social</Link>
                    <Link to="/search">Busca</Link>
                </div>
                <div className="imgAvatar">
                    {user === null ? (
                        <>
                            <div className="links">
                                <Link to="/">Entrar</Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <img src={(user.avatarUrl === undefined ||  user.avatarUrl === null) ? 
                                avatarImg : user.avatarUrl} alt="Foto do usuario"/>
                            <button className="btnlogout" onClick={handleLogout}>Sair</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}