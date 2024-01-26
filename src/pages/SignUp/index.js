import { useState, useContext } from "react"

import { Link } from "react-router-dom"

import { AuthContext } from "../../contexts/auth"

export default function SignUp(){
  const [name, setName] = useState("")
  const [user_name, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { signUp, loadingAuth } = useContext(AuthContext)

  async function handleSubmit(e){
    e.preventDefault()
    if(name !== "" && email !== "" && password !== "" && user_name !== ""){
      await signUp(email, password, name, user_name)
    }
  }
  return(
    <div className="login-container">
      <h1>Cadastre-se</h1>
      <span>Crie sua conta!</span>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" value={name} 
          onChange={(e)=> setName(e.target.value)}
        />
        <input type="text" placeholder="User Name" value={user_name} 
          onChange={(e)=> setUserName(e.target.value)}
        />
        <input type="text" placeholder="Seu email" value={email} 
          onChange={(e)=> setEmail(e.target.value)}
        />
        <input autoComplete={false} type="password" placeholder="Sua Senha" value={password} 
          onChange={(e)=> setPassword(e.target.value)}
        />
        <button type="submit">{loadingAuth ? "Carregando..." : "Cadastrar"}</button>
      </form>
      <Link className="button-link" to="/"> Já possui uma conta?</Link>
    </div>
  )
}