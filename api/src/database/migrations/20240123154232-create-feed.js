module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("feeds", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      series_id:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status:{
        type: Sequelize.STRING,
        allowNull: false
      },
      score:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      episode:{
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('feeds')
  }
};
