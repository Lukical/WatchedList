const Sequelize = require('sequelize');
const Users = require('../apps/models/Users');
const Series = require('../apps/models/Series');
const Lists = require('../apps/models/Lists');
const Follows = require('../apps/models/Follows');
const Feed = require('../apps/models/Feed');
const Likes = require('../apps/models/Likes')
const Commentaries = require('../apps/models/Commentaries')

const models = [Users, Series, Lists, Follows, Feed, Likes, Commentaries];
const databaseConfig = require('../configs/db');

class Database{
    constructor(){
        this.init();
    }
    init(){
        this.connection = new Sequelize(databaseConfig);
        models
        .map(model => model.init(this.connection))
        .map(model => model.associate && model.associate(this.connection.models))
    }
}

module.exports = new Database()