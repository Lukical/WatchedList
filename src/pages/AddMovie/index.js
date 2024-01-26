import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/auth"
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiFilm, FiLoader } from "react-icons/fi"
import { toast } from "react-toastify"
import api from "../../services/api"

import "./addmovie.css"

export default function AddMovie(){
    const { user } = useContext(AuthContext);
    const [userRole, setUserRole] = useState(user ? user.member: null)
    const [nome, setNome] = useState("")
    const [descricao, setDescricao] = useState("")
    const [tipo, setTipo] = useState(null)
    const [img, setImg] = useState(null)
    const [imgURL, setImgURL] = useState(null)
    const [loading, setLoading] = useState(false)
    const [episodes, setEpisodes] = useState(1)
    const [idFilme, setIdFilme] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        async function loadUser(){
            if(userRole === "member"){
                navigate("/*")
            }
        }
        loadUser();
    },[navigate, user, userRole])

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]
            if(image.type === "image/jpeg" || image.type === "image/png"){
                setImg(image)
                setImgURL(URL.createObjectURL(image))
            }
            else{
                alert("Formato inválido")
                setImgURL(null)
                setImg(null)
                return
            }
        }
    }
    async function handleRegister(e){
        e.preventDefault()
        setLoading(true)
        if(nome !== '' && descricao !== '' && tipo !== null && img !== null){
            try {
                const formData = new FormData()
                formData.append("image", img)
                const response = await api.post('/upload',
                    formData,
                    {
                        headers: { "Content-Type": "multpart/form-data" }
                    }
                )
                await api.post('/series',{
                    name: nome,
                    description: descricao,
                    img_url: response.data.url,
                    type: tipo,
                    episodes: parseInt(episodes)
                })
                toast.success("Serie criada!")
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        else{
            toast.error("Preencha todos os dados!")
            setLoading(false)
        }
    }
    async function handleDelete(e){
        e.preventDefault()
        setLoading(true)
        if(idFilme !== null){
            try {
                await api.delete(`/series/${idFilme}`)
                toast.success("Serie deletada!")
            } catch (error) {
                
            }
        }
        setLoading(false)
    }

    return(
        <div>
            {userRole !== "membro" && userRole !== null ? (
                <>
                <Header/>
                <div className="content">
                    <Title name="Adicionar">
                        <FiFilm size={25}/>
                    </Title>
                    <div className="container">
                        <form className="form-profile" onSubmit={handleRegister}>
                            <div className="input-labels"> 
                                <label>Nome</label>
                                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
                                <label>Descrição</label>
                                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)}/>                          
                                <div className="tiposFilme">
                                    <label htmlFor="filme">Filme</label>
                                    <input type="radio" id="filme" name="tipo" value="filme" onChange={(e) => setTipo(e.target.value)}/>
                                    <label htmlFor="serie">Serie</label>
                                    <input type="radio" id="serie" name="tipo" value="serie" onChange={(e) => setTipo(e.target.value)}/>
                                    <label htmlFor="anime">Anime</label>
                                    <input type="radio" id="anime" name="tipo" value="anime" onChange={(e) => setTipo(e.target.value)}/>
                                </div>
                                <label>Episodes</label>
                                <input type="number" value={episodes} onChange={(e) => setEpisodes(e.target.value)}/>
                                <label>Imagem</label>
                                <input type="file" accept="image/*" onChange={handleFile}/>
                                <div className="imgDivFilme">
                                    {imgURL !== null ? (
                                        <img className="imgFilme" src={imgURL} alt="foto filme" width={250} height={250}/>
                                    ): (
                                        <></>
                                    )}
                                </div>
                                <button className="btnSalvar" type="submit">
                                    {loading ? (
                                        <FiLoader size={15}/>
                                    ) : (
                                        <>Registrar</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <Title name="Remover">
                        <FiFilm size={25}/>
                    </Title>
                    <div className="container">
                        <form className="form-profile" onSubmit={handleDelete}>
                            <div className="input-labels">
                                <label>Serie</label>
                                <input type="text" value={idFilme} onChange={(e) => setIdFilme(e.target.value)}/>
                                <button className="btnSalvar" type="submit">
                                    {loading ? (
                                        <FiLoader size={15}/>
                                    ) : (
                                        <>Deletar</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                </>
            ):(
                <></>
            )}
        </div>
    )
}