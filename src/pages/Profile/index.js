import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/auth"
import { Link } from "react-router-dom"

import api from "../../services/api"

import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiUpload, FiSettings, FiLoader } from "react-icons/fi"
import avatar from "../../assets/avatar.png"

import { toast } from "react-toastify"
import "./profile.css"

export default function Profile(){
    const { user, storageUser, setUser } = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [userRole, setUserRole] = useState(user && user.member);
    const [loading, setLoading] = useState(false);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]
            if(image.type === "image/png"){
                let blob = image.slice(0, image.size, 'image/png');
                let newImage = new File([blob], `${user.user_name}.png`, {type: 'image/png'});
                setImageAvatar(newImage)
                setAvatarUrl(URL.createObjectURL(newImage))
            }
            else if(image.type === "image/jpeg"){
                let blob = image.slice(0, image.size, 'image/jpeg');
                let newImage = new File([blob], `${user.user_name}.jpeg`, {type: 'image/jpeg'});
                setImageAvatar(newImage)
                setAvatarUrl(URL.createObjectURL(newImage))
            }
            else{
                alert("Formato inválido")
                setImageAvatar(null)
                return
            }
        }
    }
    async function handleUpload(){
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("image", imageAvatar)
            const response = await api.post('/upload',
                formData,
                {
                    headers: { "Content-Type": "multpart/form-data" }
                }
            )
            await api.put("/user",{
                name: nome,
                avatar: response.data.url
            })
            let data = {
                ...user,
                nome: nome,
                avatarUrl: response.data.url
            }
            storageUser(data);
            setUser({
                ...user,
                nome: nome,
                avatarUrl: avatarUrl
            });
            toast.success("Atualizado com sucesso!")
        } catch (error) {}
        setLoading(false)
    }
    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true)
        try {
            if(imageAvatar === null && nome !== ""){
                await api.put("/user",{
                    name: nome
                })
                let data = {
                    ...user,
                    nome: nome
                }
                storageUser(data);
                setUser(data);
                toast.success("Atualizado com sucesso!");
                setLoading(false)
            }
            else if(nome !== "" && imageAvatar !== null){
                handleUpload()
            }
        } catch (error) {}
        setLoading(false)
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Meu Perfil">
                    <FiSettings size={25}/>
                </Title>
                <div className="container">
                    <form className="form-profile" onSubmit={handleSubmit}>
                        <div className="form-side">
                            <label className="label-avatar">
                                <span>
                                    <FiUpload color="fff" size={25}/>
                                </span>
                                <input type="file" accept="image/*" onChange={handleFile}/> <br/>
                                {(avatarUrl === undefined || avatarUrl === null) ? (
                                    <img src={avatar} alt="foto de perfil" width={250} height={250}/>
                                ):(
                                    <img src={avatarUrl} alt="foto de perfil" width={250} height={250}/>
                                )}
                            </label>
                        </div>
                        <div className="form-side">
                            <div className="input-labels">
                                <label>Nome</label>
                                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
                                <label>Email</label>
                                <input type="text" value={email} disabled={true}/>
                                <div className="divBtnSalvar">
                                    <button className="btnSalvar" type="submit">
                                        {loading ? (
                                            <FiLoader size={15}/>
                                        ) : (
                                            <>Salvar</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                {userRole !== "member" && userRole !== null ? (
                    <>
                        <div className="container">
                            <div className="form-profile">
                                <Link to="/addmovie">Adicionar novo filme/anime/serie</Link>
                            </div>
                        </div>  
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
}