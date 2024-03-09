import { useState, useContext } from "react"
import './signin.css'

import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"

export default function SignIn(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { signIn, loadingAuth } = useContext(AuthContext)

  async function handleLogin(e){
    e.preventDefault();
    if(email !== "" && password !== ""){
      await signIn(email, password)
    }
  }
  return(
    <div className="login-container">
      <h1>Watched List App</h1>
      <span>Salve seus filmes, series e animes favoritos em sua lista!</span>
      <form className="form" onSubmit={handleLogin}>
        <input type="text" placeholder="Seu email" value={email} 
          onChange={(e)=> setEmail(e.target.value)}
        />
        <input autoComplete={false} type="password" placeholder="***********" value={password} 
          onChange={(e)=> setPassword(e.target.value)}
        />
        <button type="submit">{loadingAuth ? "Carregando..." : "Acessar"}</button>
      </form>
      <Link className="button-link" to="/register"> Não possui uma conta?</Link>
    </div>
  )
}