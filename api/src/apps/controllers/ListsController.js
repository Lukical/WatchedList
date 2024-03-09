const Lists = require('../models/Lists')
const Users = require('../models/Users')
const Series = require('../models/Series')
const Feed = require('../models/Feed')

class ListsController{
    async create(req, res){
        const { series_id, status, score, episode } = req.body;
        const list = await Lists.findAll({
            where:{
                series_id: series_id,
                author_id: req.userId
            }
        })
        if(list.length !== 0){
            return res.status(400).json({message: 'List already exists!'})
        }
        const newList = await Lists.create({
            author_id: req.userId,
            series_id,
            status,
            score,
            episode,
        })
        if(!newList){
            return res.status(400).json({message: 'Created list failed'})
        }
        const newFeed = await Feed.create({
            author_id: req.userId,
            series_id,
            status,
            score,
            episode,
        })
        if(!newFeed){
            return res.status(400).json({message: 'Created feed failed'})
        }
        return res.status(200).json({list: newList})
    }
    async getList(req, res){
        const { id } = req.params;
        const list = await Lists.findAll({
            where:{
                series_id: id,
                author_id: req.userId
            }
        })
        if(!list){
            return res.status(400).json({message: 'Error!'})
        }
        if(list.length === 0){
            return res.status(400).json({message: 'List not found!'})
        }
        let data = {}
        for (const item of list){
            data = {
                series_id: item.series_id,
                status: item.status,
                score: item.score,
                episode: item.episode
            }
        }
        return res.status(200).json({message: data})
    }
    async updateList(req, res){
        const { status, score, episode } = req.body;
        const { id } = req.params;
        const list = await Lists.findAll({
            where:{
                series_id: id,
                author_id: req.userId
            }
        })
        if(!list){
            return res.status(400).json({message: 'Error!'})
        }
        if(list.length === 0){
            return res.status(400).json({message: 'List not found!'})
        }
        await Lists.update({
            status: status,
            score: score,
            episode: episode,
        },{
            where:{
                series_id: id,
                author_id: req.userId
            }
        })
        const newFeed = await Feed.create({
            author_id: req.userId,
            series_id: id,
            status: status,
            score: score,
            episode: episode,
        })
        if(!newFeed){
            return res.status(400).json({message: 'Created feed failed'})
        }
        return res.status(200).json({message: 'List updated!'})
    }
    async delete(req, res){
        const { id } = req.params;
        const list = await Lists.findAll({
            where:{
                series_id: id,
                author_id: req.userId
            }
        })
        if(!list){
            return res.status(400).json({message: 'Error!'})
        }
        if(list.length === 0){
            return res.status(400).json({message: 'List not found!'})
        }
        await Lists.destroy({
            where:{
                series_id: id,
                author_id: req.userId
            }
        })
        return res.status(200).json({message: "List deleted!"})  
    }
    async userList(req, res){
        const { id } = req.params;
        const user = await Users.findOne({
            where:{
                user_name: id
            }
        })
        if(!user){
            return res.status(400).json({message: 'User not found!'})
        }
        const list = await Lists.findAll({
            where:{
                author_id: user.id
            }
        })
        if(!list){
            return res.status(400).json({message: 'Error!'})
        }
        let data = []
        for (const item of list){
            try {
                let serie = await Series.findOne({
                    where: {
                        id: item.series_id
                    }
                })
                data.push({
                    series_id: serie.id,
                    name: serie.name,
                    img_url: serie.img_url,
                    type: serie.type,
                    serie_episodes: serie.episodes,
                    status: item.status,
                    score: item.score,
                    episode: item.episode
                })
            } catch (error) {
                
            }
            data.sort(function(a, b){
                return b.name - a.name
            })
        }
        const userAttr = [{
            name: user.name, user_name: user.user_name, avatar: user.avatar
        }]
        return res.status(200).json({user: userAttr, message: data})
    }
}
module.exports = new ListsController();