const Sequelize = require('sequelize')
const { Model } = require('sequelize')
const bcryptjs = require('bcryptjs')

class Users extends Model{
    static init(sequelize){
        super.init({
            name: Sequelize.STRING,
            user_name: Sequelize.STRING,
            email: Sequelize.STRING,
            avatar: Sequelize.STRING,
            member: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
        },{sequelize})
        this.addHook('beforeSave', async (user)=>{
            if(user.password){
                user.password_hash = await bcryptjs.hash(user.password, 8);
            }
            if(user.email == "adm@teste.com"){
                user.member = "adm"
            }
            else{
                user.member = "member"
            } 
        });
        return this;
    }
    checkPassword(password){
        return(bcryptjs.compare(password, this.password_hash));
    }
}
module.exports = Users