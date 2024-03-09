const Sequelize = require('sequelize')
const { Model } = require('sequelize')

class Likes extends Model{
    static init(sequelize){
        super.init({
            author_id: Sequelize.INTEGER,  
            feed_id: Sequelize.INTEGER,
        },{sequelize})
        return this;
    }
    static associate(models){}
}
module.exports = Likes;