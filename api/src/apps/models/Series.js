const Sequelize = require('sequelize')

const { Model } = require('sequelize')

class Series extends Model{
    static init(sequelize){
        super.init(
        {
            name: Sequelize.STRING,
            description: Sequelize.STRING,
            img_url: Sequelize.STRING,
            type: Sequelize.STRING,
            episodes: Sequelize.INTEGER,
        },{sequelize})
        return this;
    }
}
module.exports = Series;