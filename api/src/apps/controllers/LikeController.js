const Likes = require('../models/Likes')
const Feed = require('../models/Feed')

class LikeController{
    async create(req, res){
        const { feed_id } = req.body
        const findFeed = await Feed.findOne({
            where:{
                id: feed_id
            }
        })
        if(!findFeed){
            return res.status(400).json({message: "Feed not exists!"})
        }
        const findLike = await Likes.findAll({
            where:{
                author_id: req.userId,
                feed_id: feed_id
            }
        })
        if(findLike.length !== 0){
            return res.status(400).json({message: "Feed already liked!"})
        }
        const newLike = await Likes.create({
            author_id: req.userId,
            feed_id: feed_id
        })
        if(!newLike){
            return res.status(400).json({message: "Erro to like this feed"})
        }
        return res.status(200).json({message: "Feed liked!"})
    }
    async delete(req, res){
        const { id } = req.params;
        const liked = await Likes.findAll({
            where:{
                author_id: req.userId,
                feed_id: id
            }
        })
        if(!liked){
            return res.status(400).json({message: "Error to find like!"})
        }
        if(liked.length === 0){
            return res.status(400).json({message: "Like not exists"})
        }
        await Likes.destroy({
            where:{
                author_id: req.userId,
                feed_id: id
            }
        })
        return res.status(200).json({message: "Like deleted!"})
    }
    async getLikes(req, res){
        const { id } = req.params;
        const liked = await Likes.findAll({
            where:{
                feed_id: id
            }
        })
        if(!liked){
            return res.status(400).json({message: "Error to find like!"})
        }
        return res.status(200).json({message: liked.length})
    }
    async getUserLike(req, res){
        const { id } = req.params;
        let isLiked = false
        const liked = await Likes.findAll({
            where:{
                feed_id: id,
                author_id: req.userId,
            }
        })
        if(!liked){
            return res.status(400).json({message: "Error to find like!"})
        }
        if(liked.length !== 0){
            isLiked = true
        }
        return res.status(200).json({message: isLiked})
    }
}
module.exports = new LikeController();