const Users = require("../models/Users")
const bcryptjs = require('bcryptjs')

class UserController{
    async create(req, res){
        const verifyUser = await Users.findAll({
            where:{
                email: req.body.email,
                user_name: req.body.user_name
            }
        })
        if(verifyUser.length !== 0){
            return res.status(400).json({message: "User already exists!"})
        }
        const user = await Users.create(req.body)
        if(!user){
            return res.status(400).json({message: "Failed to create a user!"})
        }
        return res.send({message: "User created!"})
    }
    async update(req, res){
        const { name, avatar } = req.body
        const user = await Users.findOne({
            where: {
                id: req.userId
            }
        })
        if(!user){
            return res.status(400).json({message: "User not exists!"})
        }
        await Users.update(
            {
                name: name || user.name,
                avatar: avatar || user.avatar,
            },
            {
                where: { 
                    id: user.id
                }
            }
        )
        return res.status(200).json({message: 'User updated!'})
    }
    async delete(req, res){
        const userToDelete = await Users.findOne({
            where:{
                id: req.userId
            }
        })
        if(!userToDelete){
            return res.status(400).json({message: "User not exists!"})
        }
        await Users.destroy({
            where: {
                id: req.userId
            }
        })
        return res.status(200).json({message: "User deleted!"})
    }
    async userProfile(req, res){
        const user = await Users.findOne({
            attributes: ['name', 'user_name', 'email', 'avatar'],
            where: {
                id: req.userId
            }
        })
        if(!user){
            return res.status(400).json({message: 'User not exists!'})
        }
        const {name, user_name, email, avatar} = user;
        return res.status(200).json({
            name, user_name, email, avatar
        })
    }
    async allUsers(req, res){
        const users = await Users.findAll({
            order:[
                ['name', 'ASC']
            ],
            attributes: ['name', 'user_name', 'avatar'],
        })
        if(!users){
            return res.status(400).json({message: 'Erro to find users!'})
        }
        return res.status(200).json({
            users
        })
    }
}
module.exports = new UserController();