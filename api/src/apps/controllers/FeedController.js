const Users = require("../models/Users")
const Series = require("../models/Series")
const Feed = require("../models/Feed")
const Follows = require("../models/Follows")

class FeedController{
    async getHome(req, res){
        let dataFeed = []
        let ids = []
        ids.push(req.userId)
        const followed = await Follows.findAll({
            where: {
                user_id: req.userId
            }
        })
        if(!followed){
            return res.status(400).json({message: "Erro finding following"})
        }
        for (const item of followed){
            ids.push(item.followed_id)
        }
        for (const itm of ids){
            const userFeed = await Feed.findAll({
                include:[
                    {model: Users, as: 'user', required: true},
                    {model: Series, as: 'serie', required: true}
                ],
                where:{
                    author_id: itm
                }
            })
            for (const item of userFeed){
                dataFeed.push({
                    id: item.id,
                    name: item.user.name,
                    user_name: item.user.user_name,
                    avatar: item.user.avatar,
                    serie_id: item.serie.id,
                    serie: item.serie.name,
                    serie_avatar: item.serie.img_url,
                    serie_type: item.serie.type,
                    status: item.status,
                    score: item.score,
                    episode: item.episode,
                    created: item.createdAt
                })
            }
            if(!userFeed){
                return res.status(400).json({message: "Erro finding user feed"})
            }
        }
        dataFeed.sort(function(a, b){
            return b.created - a.created
        })
        return res.status(200).json({message: dataFeed})
    }
    async delete(req, res){
        const { id } = req.params;
        const feed = await Feed.findAll({
            where:{
                id: id,
                author_id: req.userId,
            }
        })
        if(!feed){
            return res.status(400).json({message: "Erro to delete this feed!"})
        }
        if(feed.length === 0){
            return res.status(400).json({message: "Feed not found!"})
        }
        await Feed.destroy({
            where:{
                id: id,
                author_id: req.userId,
            }
        })
        return res.status(200).json({message: "Feed deleted!"})  
    }
}
module.exports = new FeedController();