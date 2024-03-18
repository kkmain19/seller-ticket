const env = require('./env.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  env.dbname,
  env.dbuser,
  env.dbpass
  , {
    host:env.dbconfig.host,
    port:env.dbconfig.port,
  dialect: env.dialect,
  dialectModule: require('mysql2'),
  operatorsAliases: false,
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../model/user.model.js')(sequelize, Sequelize);
db.role = require('../model/role.model.js')(sequelize, Sequelize);
db.userRoles = require('../model/user_roles.model.js')(sequelize, Sequelize);
db.activity = require('../model/activity.model.js')(sequelize, Sequelize);
db.museum = require('../model/museum.model.js')(sequelize, Sequelize);
db.activityMethod = require('../model/activity_method.model.js')(sequelize, Sequelize);
module.exports = db;
