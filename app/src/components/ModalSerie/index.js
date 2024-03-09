import "./modal.css"
import api from "../../services/api";
import { FiX } from "react-icons/fi"
import { toast } from "react-toastify";

export default function ModalSerie({ conteudo, close }){
    async function handleSave(){
        let episodeAtual = conteudo.episode
        let statusAtual = conteudo.status
        let scoreAtual = conteudo.score
        if(conteudo.status === "Completed" && conteudo.episode < conteudo.filme.episodes){
            episodeAtual = conteudo.filme.episodes
        }
        else if(conteudo.episode === conteudo.filme.episodes && conteudo.status !== "Completed"){
            statusAtual = "Completed"
        }
        if(conteudo.status === "Plan to Watch"){
            episodeAtual = 0 
            scoreAtual = 0
            statusAtual = "Plan to Watch"
        }
        if(!conteudo.inList){
            try {
                await api.post('/lists',{
                    series_id: parseInt(conteudo.id),
                    status: statusAtual,
                    score: parseInt(scoreAtual),
                    episode: parseInt(episodeAtual)
                })
                conteudo.setStatus(statusAtual)
                conteudo.setScore(scoreAtual)
                conteudo.setEpisode(episodeAtual)
                conteudo.setInList(true)
                toast.success("Adicionado na lista!")
            } catch (error) {
                
            }
        }
        else{
            try {
                await api.put(`/lists/${conteudo.id}`,{
                    status: statusAtual,
                    score: parseInt(scoreAtual),
                    episode: parseInt(episodeAtual)
                })
                conteudo.setStatus(statusAtual)
                conteudo.setScore(scoreAtual)
                conteudo.setEpisode(episodeAtual)
                conteudo.setInList(true)
                toast.success("Atualizado!")
            } catch (error) {
                
            }
        }
    }
    async function handleDelete(){
        if(conteudo.inList){
            try {
                await api.delete(`/lists/${conteudo.id}`)
                conteudo.setInList(false)
                conteudo.setStatus("Plan to Watch")
                conteudo.setScore(0)
                conteudo.setEpisode(0)
                toast.success("Deletado da lista!")
            } catch (error) {
                toast.error("Ocorreu um erro!")
            }
        }   
    }
    function changeStatus(e){
        conteudo.setStatus(e.target.value)
        if(e.target.value === "Completed"){
            conteudo.setEpisode(conteudo.filme.episodes)
        }
    }
    function changeScore(e){
        if(e.target.value > 10){
            conteudo.setScore(10)
        }
        else if(e.target.value < 0){
            conteudo.setScore(0)
        }
        else{
            conteudo.setScore(e.target.value)
        }
    }
    function changeEpisode(e){
        if(e.target.value < 0){
            conteudo.setEpisode(0)
        }
        else if(e.target.value > conteudo.filme.episodes){
            conteudo.setEpisode(conteudo.filme.episodes)
        }
        else{
            conteudo.setEpisode(e.target.value)
        }
    }
    return(
        <div className="modal" id="modalSeries">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={25} color="#FFF"/> Voltar
                </button>
                <main>
                    <div className="row">
                        <span>Status</span>
                        <div id="perguntaForm">
                            <select className="" value={conteudo.status} id="status" onChange={(e)=>changeStatus(e)}>
                                <option value="Watching">Watching</option>
                                <option value="Plan to Watch">Plan to Watch</option>
                                <option value="Completed">Completed</option>
                                <option value="Holding">Holding</option>
                                <option value="Droped">Droped</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <span>Score</span>
                        <input type="number" max="10" min="0" value={conteudo.score} onChange={(e)=>changeScore(e)}/>
                    </div>
                    <div className="row">
                        <span>Episode</span>
                        <input type="number" min="0" value={conteudo.episode} onChange={(e)=>changeEpisode(e)}/>
                    </div>
                </main>
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="delete-button" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}