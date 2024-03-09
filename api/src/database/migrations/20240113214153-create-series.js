module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("series", {
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
      description:{
        type: Sequelize.STRING,
      },
      img_url:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      type:{
        type: Sequelize.STRING,
      },
      episodes:{
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('series')
  }
};
