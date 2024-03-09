const Series = require('../models/Series')
const Users = require('../models/Users')
const Feed = require("../models/Feed")
const Lists = require('../models/Lists')
const Likes = require('../models/Likes')
const Commentaries = require('../models/Commentaries')

class SeriesController{
    async create(req, res){
        const user = await Users.findOne({
            attributes: ['name', 'member'],
            where: {
                id: req.userId
            }
        })
        if(user.dataValues.member !== "adm"){
            return res.status(401).json({
                message: 'You dont have permission to create a series.'
            })
        }
        const {name, description, img_url, type, episodes} = req.body
        const newPost = await Series.create({
            name,
            description,
            img_url,
            type,
            episodes
        })
        if(!newPost){
            return res.status(400).json({message: "Created post failed"})
        }
        return res.status(200).json({data: newPost})
    }
    async delete(req, res){
        const { id } = req.params;
        const user = await Users.findOne({
            attributes: ['name', 'member'],
            where: {
                id: req.userId
            }
        })
        if(user.dataValues.member !== "adm"){
            return res.status(401).json({
                message: 'You dont have permission to delete a series.'
            })
        }
        const verify = await Series.findOne({
            where:{
                id
            }
        })
        if(!verify){
            return res.status(404).json({message: "Series does not exists"})
        }
        const deletedSerie = await Series.destroy({
            where:{
                id
            }
        })
        if(!deletedSerie){
            return res.status(400).json({message: "Failed to delete this series."})
        }
        let feedsIds = await Feed.findAll({
            where:{
                series_id: id
            }
        })
        let feeds = await Feed.destroy({
            where:{
                series_id: id
            }
        })
        for (const item of feedsIds){
            await Likes.destroy({
                where:{
                    feed_id: item.id
                }
            })
            await Commentaries.destroy({
                where:{
                    feed_id: item.id
                }
            })
        }
        let lists = await Lists.destroy({
            where:{
                series_id: id
            }
        })
        return res.status(200).json({message: "Series deleted!"})
    }
    async listAllSeries(req, res){
        const allSeries = await Series.findAll({
            order:[
                ['name', 'ASC']
            ],
        })
        if(!allSeries){
            return res.status(400).json({message: 'Failed to list Series!'})
        }
        const data = [];
        for (const item of allSeries){
            data.push({
                id: item.id,
                name: item.name,
                description: item.description,
                img_url: item.img_url,
                type: item.type,
                episodes: item.episodes
            })
        }
        return res.status(200).json({
            data: data
        })
    }
    async listSerie(req, res){
        const { id } = req.params;
        const serie = await Series.findOne({
            where:{
                id
            }
        })
        if(!serie){
            return res.status(404).json({message: "Series does not exists"})
        }
        return res.status(200).json({message: serie})
    }
}
module.exports = new SeriesController();