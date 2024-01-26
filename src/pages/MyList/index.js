import Header from "../../components/Header";
import Title from "../../components/Title";
import { Link } from "react-router-dom"

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../contexts/auth"
import { useParams } from 'react-router-dom';
import api from "../../services/api";

import { FiMonitor, FiLoader } from "react-icons/fi"
import avatar from "../../assets/avatar.png"
import "./mylist.css"

export default function MyList(){
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [userView, setUserView] = useState(null)
  const [ isEmpty, setIsEmpty ] = useState(true);
  const [ series, setSeries ] = useState([]);
  const [ filmes, setFilmes ] = useState([]);
  const [ animes, setAnimes ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ isFollowing, setIsFollowing ] = useState(false);
  const [ loadingFollow, setLoadingFollow ] = useState(false)

  useEffect(()=>{
    async function loadSeriesList(){
      setLoading(true)
      try {
        const response = await api.get(`user-list/${id}`)
        setUserView(response.data.user[0])
        let data = response.data.message
        setFilmes([])
        setAnimes([])
        setSeries([])
        let lista1 = []
        let lista2 = []
        let lista3 = []
        data.forEach(element => {
          if(element.type === 'filme'){
            setIsEmpty(false)
            lista1.push(element)
          }
          else if(element.type === 'serie'){
            setIsEmpty(false)
            lista2.push(element)
          }
          else if(element.type === 'anime'){
            setIsEmpty(false)
            lista3.push(element)
          }
        });
        setFilmes(filmes => [...filmes, ...lista1])
        setSeries(series => [...series, ...lista2])
        setAnimes(animes => [...animes, ...lista3])
        try {
          await api.get(`/follows/${id}`)
          setIsFollowing(true)
        } catch (error) {
          setIsFollowing(false)
        } 
      } catch (error) {
        setUserView({id: null, name: "", avatar: null})
      }
      setLoading(false)
    }
    loadSeriesList();
  },[id, user])

  async function handleAddFriend(){
    if(!loadingFollow){
      if(!isFollowing){
        setLoadingFollow(true)
        try {
          await api.post('/follows',{
            followed_id: id
          })
          setIsFollowing(true)
        } catch (error) {}
      }
      else{
        setLoadingFollow(true)
        try {
          await api.delete(`/follows/${id}`,)
          setIsFollowing(false)
        } catch (error) {}
      }
      setLoadingFollow(false)
    }
  }

  return(
    <div>
      <Header/>
      <div className="content">
        <Title className="title" name="Minha Lista">
          <FiMonitor size={25}/>
        </Title>
        {loading ? (
          <label>Carregando...<FiLoader size={25}/></label>
          ):(
          <>
            <div className="container">
              <div className="mylistcontainer">
                <div className="mylistUser">
                  {userView.avatar ? (
                    <img src={userView.avatar} alt="perfil usuario"></img>
                  ) : (
                    <img src={avatar} alt="perfil usuario"></img>
                  ) }
                  <label>{userView.name}</label>
                  <label>Total: {series.length + filmes.length + animes.length}</label>
                  {(userView.user_name !== user.user_name && userView.id !== null) && (
                    <button className="buttonAdd" onClick={()=>handleAddFriend()}>
                      {isFollowing ?(
                        <>Remover</>
                      ) : (
                        <>Adicionar</>
                      )}
                    </button>
                  )}
                  
                </div>
                {isEmpty ? (
                <>
                  <h1 className="emptyLabel">Lista vazia!</h1>
                </>) : (
                <>
                  <div className="mylistcontent">
                    <table>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Serie</th>
                          <th>Status</th>
                          <th>Score</th>
                          <th>Episode</th>
                        </tr>
                      </thead>
                      <tbody>
                        {series.length !== 0 ? (
                          <>
                            <h1>Series</h1>
                            {series.map((item, index)=>{
                              return(
                                <>
                                  <Link to={`/${item.type}/${item.series_id}`}>
                                    <tr>
                                      <td><img src={item.img_url} alt="foto serie"/></td>
                                      <td>{item.name}</td>
                                      <td>{item.status}</td>
                                      <td>{item.score}</td>
                                      <td>{item.episode}</td>              
                                    </tr>
                                  </Link>                               
                                </>
                              )
                            })}
                          </>
                        ) :(
                          <></>
                        )}
                        {filmes.length !== 0 ? (
                          <>
                          <h1>Filmes</h1>
                          {filmes.map((item, index)=>{
                            return(
                              <>
                                <Link to={`/${item.type}/${item.series_id}`}>
                                  <tr>
                                    <td><img src={item.img_url} alt="foto serie"/></td>
                                    <td>{item.name}</td>
                                    <td>{item.status}</td>
                                    <td>{item.score}</td>
                                    <td>{item.episode}</td>              
                                  </tr>
                                </Link>                               
                              </>
                            )
                          })}</>
                        ) :(
                          <></>
                        )}
                        {animes.length !== 0 ? (
                          <>
                          <h1>Animes</h1>
                          {animes.map((item, index)=>{
                            return(
                              <>
                                <Link to={`/${item.type}/${item.series_id}`}>
                                  <tr>
                                    <td><img src={item.img_url} alt="foto serie"/></td>
                                    <td>{item.name}</td>
                                    <td>{item.status}</td>
                                    <td>{item.score}</td>
                                    <td>{item.episode}</td>              
                                  </tr>
                                </Link>                               
                              </>
                            )
                          })}</>
                        ) :(
                          <></>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}