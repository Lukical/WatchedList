const Sequelize = require('sequelize')
const { Model } = require('sequelize')

class Commentaries extends Model{
    static init(sequelize){
        super.init({
            author_id: Sequelize.INTEGER,  
            feed_id: Sequelize.INTEGER,
            commentary: Sequelize.STRING,
        },{sequelize})
        return this;
    }
    static associate(models){
        this.belongsTo(models.Users, {foreignKey: 'author_id', as: 'user'});
    }
}
module.exports = Commentaries;