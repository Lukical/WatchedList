const Sequelize = require('sequelize')
const { Model } = require('sequelize')

class Follows extends Model{
    static init(sequelize){
        super.init({
            user_id: Sequelize.INTEGER,  
            followed_id: Sequelize.INTEGER
        },{sequelize})
        return this;
    }
    static associate(models){
        this.belongsTo(models.Users, {foreignKey: 'user_id', as: 'user'});
    }
}
module.exports = Follows;