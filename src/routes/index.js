import { Route, Routes } from "react-router-dom";

import SignIn from "../pages/SignIn"
import SignUp from "../pages/SignUp";

import Erro from "../pages/Erro"
import Home from "../pages/Home";
import Private from "./Private";
import Profile from "../pages/Profile";
import AddMovie from "../pages/AddMovie";
import Search from "../pages/Search";
import Filme from "../pages/Filme";
import MyList from "../pages/MyList";
import Social from "../pages/Social";

function RoutesApp(){
    return(
        <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/register" element={<SignUp/>}/>
            <Route path="/home" element={<Private><Home/></Private>}/>
            <Route path="/profile" element={<Private><Profile/></Private>}/>
            <Route path="/addmovie" element={<Private><AddMovie/></Private>}/>
            <Route path="/search" element={<Private><Search/></Private>}/>
            <Route path='/filme/:id' element={<Private><Filme/></Private>}/>
            <Route path='/serie/:id' element={<Private><Filme/></Private>}/>
            <Route path='/anime/:id' element={<Private><Filme/></Private>}/>
            <Route path='/user/:id' element={<Private><MyList/></Private>}/>
            <Route path='/social' element={<Private><Social/></Private>}/>
            <Route path='*' element={ <Erro/> }/>
        </Routes>
    )
}
export default RoutesApp;