import Header from "../../components/Header";
import Title from '../../components/Title';
import ModalSerie from "../../components/ModalSerie"

import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from "../../services/api";
import { AuthContext } from "../../contexts/auth"

import { FiFilm, FiLoader } from "react-icons/fi"
import "./filme.css"

export default function Filme(){
    const { id } = useParams();
    const { user } = useContext(AuthContext)
    const [filme, setFilme] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState("Plan to Watch")
    const [score, setScore] = useState(0)
    const [episode, setEpisode] = useState(0)
    const [inList, setInList] = useState(null)

    useEffect(()=>{
        async function loadFilme(){
          try {
            const response = await api.get(`/series/${id}`)
            setFilme(response.data.message)
          } catch (error) {
            setFilme(null)
          }
          try {
            const userData = await api.get(`/lists/${id}`)
            const data = userData.data.message
            setStatus(data.status)
            setScore(data.score)
            setEpisode(data.episode)
            setInList(true)
          } catch (error) {
            setInList(null)
          }
          setLoading(false)
        }
        loadFilme()
    },[id, user])

    function toggleModal(){
      if(user){
        setShowModal(!showModal)
      }
    }

    window.onclick = function(event) {
      var modal = document.getElementById('modalSeries');
      if (event.target === modal) {
        toggleModal();
      }
    }

    return(
    <div>
      <Header/>
      <div className="content">
        {loading ? (
          <label>Carregando...<FiLoader size={25}/></label>
        ) : (
          <>
            {filme !== null ? (
              <>
              <Title className="title" name={filme.type}>
                <FiFilm size={25}/>
              </Title>
              <div className='container'>
                <div className='info-filme-box'>
                  <div className='info-filme-container'>
                    <div className='info-filme'>
                      <img className='info-img-filme' src={filme.img_url} alt='imagem serie'></img>
                      <div className='div-info-filme-add'>
                        <button id="buttonModal" className='info-filme-add' onClick={()=>toggleModal()}>
                          {inList ? (
                            <>{status}</>
                          ) : (
                            <>Adicionar a lista</>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className='info-filme'>
                      <label className='info-filme-nome'>{filme.name}</label>
                      <label className='info-filme-descricao'>{filme.description}</label>
                    </div>
                  </div>
                </div>
              </div>    
              </>
            ) : (
              <>Filme não encontrado!</>
            )}
          </>
        )}
      </div>
      {showModal && (
        <ModalSerie
          conteudo={{ filme, id, status, setStatus, score, setScore, episode, setEpisode, inList, setInList }}
          close={()=> setShowModal(!showModal)}
        />
      )}
    </div>
  )
}