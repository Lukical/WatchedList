import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"

export default function Erro(){
  const navigate = useNavigate()
  useEffect(()=>{
    async function load(){
      navigate("/*")
    }
    load();
  },[navigate])
  return(
    <div>
      <Header/>
      <div className="content">
        <h1>Pagina não encontrada!</h1>
      </div>
    </div>
  )
}