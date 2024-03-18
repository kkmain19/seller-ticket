const db = require('../config/db.config.js')
module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('users', {
		firstname:{
			type: Sequelize.STRING,
			allowNull: false
		},
		lastname:{
			type: Sequelize.STRING,
			allowNull: false
		},
	  username: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  phone:{
		type: Sequelize.STRING,
		allowNull: false
	  },
	  address:{
		type: Sequelize.STRING,
		allowNull: false
	  },
	  image: {
		type: Sequelize.STRING,
		allowNull: true
	  },
	  email: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  password: {
		type: Sequelize.STRING,
		allowNull: false
	  }
	});

	// User.associate = (models) => {
    //     User.hasMany(models.Comments, { foreignKey: 'userId',as: 'comments' });
    // };
	return User;
  };