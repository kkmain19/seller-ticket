const db = require('../config/db.config.js')
module.exports = (sequelize, Sequelize) => {
	const Activity = sequelize.define('museum_activity', {
		activityname:{
			type: Sequelize.STRING,
			allowNull: false
		},
		ticketquantity:{
			type: Sequelize.STRING,
			allowNull: false
		}
	});

	return Activity;
  };