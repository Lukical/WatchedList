import { useState, useEffect } from "react";
import Header from "../../components/Header";

import { Link } from "react-router-dom";

import api from "../../services/api";

import { FiLoader } from "react-icons/fi"
import "./search.css"

export default function Search(){
  const [loading, setLoading] = useState(true)
  const [filmes, setFilmes] = useState([])
  const [series, setSeries] = useState([])
  const [animes, setAnimes] = useState([])
  const [lastDocsFilme, setLastDocsFilme] = useState()
  const [lastDocsSerie, setLastDocsSerie] = useState()
  const [lastDocsAnime, setLastDocsAnime] = useState()
  const [loadingMore, setLoadingMore] = useState(false)

  const limitSearch = 10

  useEffect(()=>{
    async function loadSeries(){
      setLoading(true)
      setFilmes([])
      setSeries([])
      setAnimes([])
      try {
        const response = await api.get('/series')
        let data = response.data.data
        let lista1 = []
        let lista2 = []
        let lista3 = []
        data.forEach(element => {
          if(element.type === 'filme'){
            lista1.push(element)
          }
          else if(element.type === 'serie'){
            lista2.push(element)
          }
          else if(element.type === 'anime'){
            lista3.push(element)
          }
        });
        setFilmes(filmes => [...filmes, ...lista1])
        setSeries(series => [...series, ...lista2])
        setAnimes(animes => [...animes, ...lista3])
      } catch (error) {}
      setLoading(false)
    }
    loadSeries();
    return () => {}
  },[])

  return(
    <div>
      <Header/>
      {!loading ? (
      <div className="content">
        <div className="container">
          <h1>Filmes</h1>
          <div className="filmesContainer">
            {filmes.map((item, index)=>{
              if(item.type === "filme"){
                return(
                  <Link to={`/${item.type}/${item.id}`} className="previewFilme">
                    <img className="imgSrFilme" src={item.img_url} alt="foto de perfil"/>
                    <label className="nomeFilme">{item.name}</label>
                  </Link>
                )
              }
              else{ return <></>}
            })}
          </div>
          <div className="divBtnMore">
            {!loadingMore && filmes.length > 0 && <button
              className="btnMore">Buscar mais
            </button>}
          </div>   
        </div>
        <div className="container">
          <h1>Series</h1>
          <div className="filmesContainer">
              {series.map((item, index)=>{
                if(item.type === "serie"){
                  return(
                    <Link to={`/${item.type}/${item.id}`} className="previewFilme">
                      <img className="imgSrFilme" src={item.img_url} alt="foto de perfil"/>
                      <label className="nomeFilme">{item.name}</label>
                    </Link>
                  )
                }
                else{ return <></>}
              })}
          </div>
          <div className="divBtnMore">
            {!loadingMore && series.length > 0 && <button
            className="btnMore">Buscar mais
            </button>}
          </div> 
        </div>
        <div className="container">
          <h1>Animes</h1>
          <div className="filmesContainer">
            {animes.map((item, index)=>{
              if(item.type === "anime"){
                return(
                  <Link to={`/${item.type}/${item.id}`} className="previewFilme">
                    <img className="imgSrFilme" src={item.img_url} alt="foto de perfil"/>
                    <label className="nomeFilme">{item.name}</label>
                  </Link>
                )
              }
              else{ return <></>}
            })}
          </div>
          <div className="divBtnMore">
            {!loadingMore && animes.length > 0 && <button
            className="btnMore">Buscar mais
            </button>}
          </div>   
        </div>
      </div>
      ) : (
        <>
          <div className="content">
            <label>Carregando...<FiLoader size={25}/></label>
          </div>
        </>
      )}
    </div>
  )
}