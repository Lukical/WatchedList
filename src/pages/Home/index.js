import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../contexts/auth"
import api from '../../services/api';

import Header from "../../components/Header";
import Title from "../../components/Title"
import Time from '../../components/Time';
import { Link } from "react-router-dom"
import ModalComments from "../../components/ModalComments"

import { intervalToDuration, differenceInSeconds } from "date-fns"
import { FiHome, FiLoader, FiTrash } from "react-icons/fi"
import { GrTip } from "react-icons/gr";
import avatar from "../../assets/avatar.png"
import like from "../../assets/like.png"
import likeada from "../../assets/likeada.png"
import { toast } from "react-toastify"
import "./home.css"

export default function Home(){
  const { user } = useContext(AuthContext);
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [curFeed, setCurFeed] = useState();

  useEffect(()=>{
    async function loadHome(){
      setFeed([])
      try {
        const response = await api.get('/feed')
        const data = response.data.message
        let lista = []
        for (const element of data){
          let likes = await api.get(`/like/${element.id}`)
          let userLike = await api.get(`/like-user/${element.id}`)
          let commentary = await api.get(`/commentary-size/${element.id}`)
          lista.push(setListFeed(element, likes.data.message, userLike.data.message,
            commentary.data.message
          ))
        }
        setFeed(feed => [...feed, ...lista])
        setLoading(false)
      } catch (error) {}
    }
    loadHome()
  },[user])

  function setListFeed(data, likes, userLike, commentary){
    let timePast = differenceInSeconds(new Date(), data.created)
    let lista = {
      id: data.id,
      name: data.name,
      user_name: data.user_name,
      avatar: data.avatar,
      serie_id: data.serie_id,
      serie: data.serie,
      serie_avatar: data.serie_avatar,
      serie_type: data.serie_type,
      status: data.status,
      score: data.score,
      episode: data.episode,
      created: data.created,
      createdFormat: intervalToDuration({start: 0, end: timePast * 1000}),
      likes: likes,
      isLiked: userLike,
      commentary: commentary        
    }
    return lista
  }

  async function handleLike(feedId, id, likes){
    try {
      let element = document.getElementById(id)
      element.className = element.className === "socialButton liked" ? "socialButton notliked" : "socialButton liked"
      if(element.className === "socialButton liked"){
        if(!feed[id].isLiked){
          await api.post('/like',{
            feed_id: feedId
          })
          feed[id].likes = likes + 1
          document.getElementById(`img${id}`).src = likeada
          feed[id].isLiked = true
        }
      }
      else{
        if(feed[id].isLiked){
          await api.delete(`/like/${feedId}`)
          feed[id].likes = likes - 1
          document.getElementById(`img${id}`).src = like
          feed[id].isLiked = false
        }
      }
      let likeLabel = document.getElementById(`like${id}`)
      likeLabel.innerHTML = feed[id].likes > 0 ? feed[id].likes : "" 
    } catch (error) {}
  }

  async function handleDeleteFeed(item){
    try {
      await api.delete(`/feed/${item.id}`)
      let lista = []
      feed.forEach((data)=>{
        if(data.id !== item.id){
          lista.push(data)
        }
      })
      setFeed(lista)
      toast.success("Atividade deletada!")
    } catch (error) {
      toast.error("Ocorreu um erro ao deletar!")
    }
  }

  function handleCommentary(item){
    setCurFeed(item)
    toggleModal()
  }

  function toggleModal(){
    if(user){
      setShowModal(!showModal)
    }
  }
  window.onclick = function(event) {
    var modal = document.getElementById('modalComments');
    if (event.target === modal) {
      toggleModal();
    }
  }

  return(
    <div>
      <Header/>
      <div className="content">
        <Title className="title" name="Home">
          <FiHome size={25}/>
        </Title>
        {loading ? (
          <>
            <label>Carregando...<FiLoader size={25}/></label>
          </>):(
          <>
            {feed.length > 0 ? (
              <>
                <div className="">
                  <div className="homeContainer">
                    {feed.map((item, index)=>{
                      return(
                        <>
                          <div id={`feed${item.id}`} className="feedContainer">
                            <div className="feedContent"> 
                              <Link to={`/${item.serie_type}/${item.serie_id}`}>
                                <img src={item.serie_avatar} alt="foto serie"/>
                              </Link>
                              <div className="labelContent">
                                <label><Link to={`/user/${item.user_name}`}>{item.name}</Link></label>
                                <label>
                                  {item.status} {item.episode > 0 && item.status !== "Completed" &&<>episode {item.episode}</>}
                                  <Link to={`/${item.serie_type}/${item.serie_id}`}> {item.serie}</Link>
                                </label>
                                <Link to={`/user/${item.user_name}`}>
                                  <img className="fotoUser" src={item.avatar !== null ? item.avatar : avatar} alt="foto user"/>
                                </Link>
                              </div>
                              <div className="socialDiv">
                                <div className="timeDiv">
                                  <Time time={item.createdFormat}/>
                                  <div>
                                    {item.user_name === user.user_name && 
                                      <div className="deletePost">
                                        <button className="deleteFeedButton" onClick={()=>handleDeleteFeed(item)}>
                                          <FiTrash className="trash" size={15}/>
                                        </button>
                                      </div>
                                    }
                                  </div>
                                </div>
                                <div className="socialLabel">
                                  <div className="likeLabel">
                                    <label id={`like${index}`} className="numberLikes">
                                      {item.likes > 0 ? item.likes : <></>}
                                    </label>
                                    {item.isLiked ? (
                                      <>
                                        <button id={index} className="socialButton liked" onClick={()=>handleLike(item.id, index, item.likes)}>
                                          <img id={`img${index}`} className="like" src={likeada} alt="likeImg"/>
                                        </button>
                                      </>
                                    ) : (
                                    <>
                                      <button id={index} className="socialButton notliked" onClick={()=>handleLike(item.id, index, item.likes)}>
                                        <img id={`img${index}`} className="like" src={like} alt="likeImg"/>
                                      </button>
                                    </>)}
                                  </div>
                                  <div>
                                    <button className="socialButton" onClick={()=>handleCommentary(item)}>
                                      { item.commentary > 0 && <label>{item.commentary }</label>}
                                      <GrTip className="chat" size={15}/>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="homeContainer">
                  <div style={{margin: "0 auto"}}>
                    <h1>Não há atividades no momento.</h1>
                    <label>Tente adicionar series a sua lista ou seguir novos usuário!</label>
                  </div>
                </div>
              </>
            )}
          </>)}
      </div>
      {showModal && (
        <ModalComments
          conteudo={ curFeed }
          close={()=> setShowModal(!showModal)}
        />
      )}
    </div>
  )
}