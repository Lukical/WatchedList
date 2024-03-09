require ("dotenv").config()
module.exports = {
    dialect: process.env.DIALECT,
    host: process.env.HOST,
    username: process.env.DB_USERNAME,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    }
}