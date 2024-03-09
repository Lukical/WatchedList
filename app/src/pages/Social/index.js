import Header from "../../components/Header";
import Title from "../../components/Title";

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../contexts/auth"
import api from "../../services/api";

import { Link } from "react-router-dom";
import { FiCoffee, FiLoader } from "react-icons/fi"
import avatar from "../../assets/avatar.png"
import "./social.css"

export default function Social(){
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
      async function loadUsers(){
        setLoading(true)
        try {
          const response = await api.get('/users')
          setUsers(response.data.users) 
        } catch (error) {}
        setLoading(false)
      }
      loadUsers()
    },[user])
    
    return(
    <div>
      <Header/>
      <div className="content">
        <Title className="title" name="Social">
            <FiCoffee size={25}/>
        </Title>
        {loading ? (
        <>
          <label>Carregando...<FiLoader size={25}/></label>
        </>) : (
        <>
          <div className="container">
            <div className="topUsersContainer">
              <div className="middleUsersContainer">
                <div className="usersContainer">
                  {users.length > 0 ? (
                    <>
                      {users.map((item, index)=>{
                      return(
                        <Link to={`/user/${item.user_name}`} className="userLink">
                          {item.avatar ? (
                            <img className="imgUser" src={item.avatar} alt="foto usuario"/>
                          ) : (
                            <img className="imgUser" src={avatar} alt="foto usuario"/>
                          ) }
                          <div className="divNome">
                            <label className="nomeUser">{item.name}</label>
                          </div>
                        </Link>
                      )
                    })}
                  </>):(
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>)}
      </div>
    </div>
  )
}