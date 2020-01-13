var Sequelize = require('sequelize');
var path = require('path');
var fs = require('fs');
var dotenv = require('dotenv');

dotenv.config(); //LOAD CONFIG -> process.env에 .env파일을 맵핑시킴

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host : process.env.DB_HOST,
        dialect : 'mysql',
        timezone : '+09:00',
        operatorsAliases : Sequelize.Op,
        pool : {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging : false
    });

let db = [];

fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.js') && file !== 'index.js';
    })
    .forEach(file => {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;