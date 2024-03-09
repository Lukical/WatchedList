const Commentaries = require('../models/Commentaries')
const Feed = require('../models/Feed')
const Users = require('../models/Users')

class CommentariesController{
    async create(req, res){
        const { feed_id, commentary } = req.body
        const findFeed = await Feed.findOne({
            where:{
                id: feed_id
            }
        })
        if(!findFeed){
            return res.status(400).json({message: "Feed not exists!"})
        }
        const newComment = await Commentaries.create({
            author_id: req.userId,
            feed_id: feed_id,
            commentary: commentary
        })
        if(!newComment){
            return res.status(400).json({message: "Error sending commentary!"})
        }
        let data = {
           id: newComment.id,
           commentary: newComment.commentary,
           created: newComment.createdAt
        }
        return res.status(200).json({message: data})
    }
    async getCommentaries(req, res){
        const { id } = req.params;
        const findFeed = await Feed.findOne({
            where:{
                id
            }
        })
        if(!findFeed){
            return res.status(400).json({message: "Feed not exists!"})
        }
        let dataCommentaties = []
        const commentaries = await Commentaries.findAll({
            include:[
                {model: Users, as: 'user', required: true},
            ],
            where:{
                feed_id: id
            }
        })
        if(!commentaries){
            return res.status(400).json({message: "Error finding commentaries!"})
        }
        for (const item of commentaries){
            dataCommentaties.push({
                id: item.id,
                name: item.user.name,
                user_name: item.user.user_name,
                avatar: item.user.avatar,
                commentary: item.commentary,
                created: item.createdAt,
            })
        }
        return res.status(200).json({message: dataCommentaties})
    }
    async getSizeCommentaries(req, res){
        const { id } = req.params;
        const findFeed = await Feed.findOne({
            where:{
                id
            }
        })
        if(!findFeed){
            return res.status(400).json({message: "Feed not exists!"})
        }
        const commentaries = await Commentaries.findAll({
            where:{
                feed_id: id
            }
        })
        if(!commentaries){
            return res.status(400).json({message: "Error finding comments"})
        }
        return res.status(200).json({message: commentaries.length})
    }
    async delete(req, res){
        const { id } = req.params;
        const commentary = await Commentaries.findAll({
            where:{
                id: id,
                author_id: req.userId
            }
        })
        if(!commentary){
            return res.status(400).json({message: "Error to delete comment!"})
        }
        if(commentary.length === 0){
            return res.status(400).json({message: "Comment not found!"})
        }
        await Commentaries.destroy({
            where:{
                id: id,
                author_id: req.userId
            }
        })
        return res.status(200).json({message: "Commentary deleted!"})  
    }
}
module.exports = new CommentariesController()