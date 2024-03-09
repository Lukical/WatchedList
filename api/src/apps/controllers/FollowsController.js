const Follows = require('../models/Follows')
const Users = require('../models/Users')

class FollowsController{
    async create(req, res){
        const { followed_id } = req.body;
        const user = await Users.findOne({
            where:{
                user_name: followed_id
            }
        })
        if(!user){
            return res.status(400).json({message: "User not found!"})
        }
        const isFollowed = await Follows.findAll({
            where:{
                user_id: req.userId,
                followed_id: user.id
            }
        })
        if(isFollowed.length !== 0){
            return res.status(400).json({message: "User alread followed!"})
        }
        const newFollow = await Follows.create({
            user_id: req.userId,
            followed_id: user.id
        })
        if(!newFollow){
            return res.status(400).json({message: "Follow user error"})
        }
        return res.status(200).json({message: newFollow})
    }
    async delete(req, res){
        const { id } = req.params;
        const user = await Users.findOne({
            where:{
                user_name: id
            }
        })
        if(!user){
            return res.status(400).json({message: "User not found!"})
        }
        if(user.id === req.userId){
            return res.status(400).json({message: "Error! you dont have permission!"})
        }
        await Follows.destroy({
            where:{
                user_id: req.userId,
                followed_id: user.id
            }
        })
        return res.status(200).json({message: "Follow deleted!"})
    }
    async getFollow(req, res){
        const { id } = req.params;
        const user = await Users.findOne({
            where:{
                user_name: id
            }
        })
        if(!user){
            return res.status(400).json({message: "User not found!"})
        }
        const follow = await Follows.findAll({
            where:{
                user_id: req.userId,
                followed_id: user.id
            }
        })
        if(follow.length === 0){
            return res.status(400).json({message: "Follow not found!"})
        }
        return res.status(200).json({message: "Follow found"})
    }
}
module.exports = new FollowsController();