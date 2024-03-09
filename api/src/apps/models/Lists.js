const Sequelize = require('sequelize')
const { Model } = require('sequelize')

class Lists extends Model{
    static init(sequelize){
        super.init({
            author_id: Sequelize.INTEGER,  
            series_id: Sequelize.INTEGER,
            status: Sequelize.STRING,
            score: Sequelize.INTEGER,
            episode: Sequelize.INTEGER,
        },{sequelize})
        return this;
    }
    static associate(models){
        this.belongsTo(models.Users, {foreignKey: 'author_id', as: 'user'});
    }
}
module.exports = Lists;