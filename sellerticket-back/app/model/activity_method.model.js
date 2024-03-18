const db = require('../config/db.config.js')
module.exports = (sequelize, Sequelize) => {
	const ActivityMethod = sequelize.define('activity_method', {
		round:{
			type: Sequelize.STRING,
			allowNull: false
		},
		childMethod:{
			type: Sequelize.STRING,
			allowNull: true
		},
		studentMethod:{
			type: Sequelize.STRING,
			allowNull: true
		},
		adultMethod:{
			type: Sequelize.STRING,
			allowNull: true
		},
		ageChild:{
			type: Sequelize.STRING,
			allowNull: true
		},
		ageStudent:{
			type: Sequelize.STRING,
			allowNull: true
		},
		ageAdult:{
			type: Sequelize.STRING,
			allowNull: true
		}
	});

	return ActivityMethod;
  };