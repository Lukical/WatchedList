module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false
      },
      user_name:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      avatar:{
        type: Sequelize.STRING
      },
      member:{
        type: Sequelize.STRING
      },
      password_hash:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at:{
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at:{
        type: Sequelize.DATE,
        allowNull: false,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
  }
};
