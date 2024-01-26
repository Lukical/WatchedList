import { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../contexts/auth"
import api from '../../services/api';

import { FiX, FiSend, FiTrash } from "react-icons/fi"
import likeada from "../../assets/likeada.png"
import avatar from "../../assets/avatar.png"
import Time from '../../components/Time';
import { intervalToDuration, differenceInSeconds } from "date-fns"
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import "./modalComments.css"

export default function ModalComments({ conteudo, close }){
    const { user } = useContext(AuthContext)
    const [ userText, setUserText ] = useState("")
    const [comentarios, setComentarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [reload, setReload] = useState(false)

    useEffect(()=>{
        async function loadCommentarios(){
            setLoading(true)
            setComentarios([])
            try {      
                const response = await api.get(`/commentary/${conteudo.id}`)
                updateState(response.data.message)
            } catch (error) {}
            setLoading(false)
        }
        loadCommentarios()
    },[conteudo])

    function updateState(data){
        let arr = []
        data.forEach(async(dt)=>{
            let timePast = differenceInSeconds(new Date(), dt.created)
            arr.push({
                id: conteudo.id,
                idComentario: dt.id,
                nome: dt.name,
                user_name: dt.user_name,
                img: dt.avatar,
                texto: dt.commentary,
                created: dt.created,
                createdFormat: intervalToDuration({start: 0, end: timePast * 1000})  
            })
        })
        setComentarios(comentarios => [...comentarios, ...arr])   
    }

    async function sendMessage(e){
        e.preventDefault();
        setReload(true)
        let comentariosTam = conteudo.commentary
        try {
            const response = await api.post("/commentary",{
                feed_id: conteudo.id,
                commentary: userText
            })
            let arr = comentarios
            arr.push({
                id: conteudo.id,
                idComentario: response.data.message.id,
                nome: user.nome,
                user_name: user.user_name,
                img: user.avatarUrl,
                texto: response.data.message.commentary,
                created: response.data.message.createdAt,
                createdFormat: {seconds: 1}  
            })
            setComentarios(arr)
            conteudo.commentary = comentariosTam + 1
            setUserText("")
            setReload(false)     
        } catch (error) {
            conteudo.commentary = comentariosTam
        }
        setReload(false)
    }

    async function handleDeleteMessage(item){
        let comentariosTam = conteudo.commentary
        setReload(true)
        try {
            await api.delete(`commentary/${item.idComentario}`)
            conteudo.commentary = comentariosTam - 1
            let lista = []
            comentarios.forEach(data=>{
                if(data.idComentario !== item.idComentario){
                    lista.push(data)
                }
            })
            setComentarios(lista)
            toast.success("Comentário deletado!")
        } catch (error) {
            conteudo.commentary = comentariosTam
            toast.error("Erro ao deletar comentário!")
        }
        setReload(false)
    }

    return(
        <div className="modal" id="modalComments">
            <div className="container2">
                <button className="close" onClick={close}>
                    <FiX size={25} color="#FFF"/> Voltar
                </button>
                <div className='divLike'>
                    <label className='labelLike'>{conteudo.likes}</label>
                    <img className="like" src={likeada} alt="likeImg"/>
                </div>
                {!loading ? (<>
                    <main>
                        {comentarios.length === 0 && <label>Sem comentarios ainda.</label>}
                        {!reload ? (
                        <>
                            {comentarios.map((item, index)=>{
                                return(
                                    <div className='divComentario'>
                                        <div className='userDiv'>
                                            <div className='userSpace'>
                                                <Link to={`/user/${item.user_name}`}>
                                                    <label className='nomeUser'>{item.nome}</label>
                                                </Link>
                                                <div className='timeDiv'>
                                                    <Time time={item.createdFormat}/>
                                                    {item.user_name === user.user_name && 
                                                        <div className="deletePost">
                                                            <button className="deleteFeedButton" onClick={()=>handleDeleteMessage(item)}>
                                                            <FiTrash className="trash" size={15}/>
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <Link to={`/user/${item.user_name}`}>
                                                    <img className="fotoUser" src={item.img !== null ? item.img : avatar} alt="foto user"/>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className='textoDiv'>
                                            <label className='textoComentario'>{item.texto}</label>   
                                        </div>                                 
                                    </div>
                                )
                            })}
                        </>
                        ) : (
                        <>
                            {comentarios.map((item, index)=>{
                                return(
                                    <div className='divComentario'>
                                        <div className='userDiv'>
                                            <div className='userSpace'>
                                                <label className='nomeUser'>{item.nome}</label>
                                                <div className='timeDiv'>
                                                    <Time time={item.createdFormat}/>
                                                    {item.id === user.id && 
                                                        <div className="deletePost">
                                                            <button className="deleteFeedButton" onClick={()=>handleDeleteMessage(item)}>
                                                            <FiTrash className="trash" size={15}/>
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <img  className="fotoUser" src={item.img !== null ? item.img : avatar} alt="foto user"/>
                                        </div>
                                        <div className='textoDiv'>
                                            <label className='textoComentario'>{item.texto}</label>   
                                        </div>                                 
                                    </div>
                                )
                            })}
                        </>) }
                    </main>
                </>) : (<><label>Loading...</label></>)}
                <form className='inputComment' onSubmit={sendMessage}>
                    <input type="text" placeholder="" value={userText} 
                        onChange={(e)=> setUserText(e.target.value)}
                    />
                    <button type="submit" className='sendButton'>
                        <FiSend size={15}/>
                    </button>
                </form>
            </div>
        </div>
    )
}