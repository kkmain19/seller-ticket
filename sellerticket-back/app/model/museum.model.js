const db = require('../config/db.config.js')
module.exports = (sequelize, Sequelize) => {
	const Museum = sequelize.define('museum', {
		date:{
			type: Sequelize.STRING,
			allowNull: false
		},
		museumId:{
			type: Sequelize.STRING,
			allowNull: false
		},
	  ticket: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  type:{
		type: Sequelize.STRING,
		allowNull: false
	  },
	  activityMethod:{
		type: Sequelize.STRING,
		allowNull: false
	  },
	  fullname: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  phone: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  email: {
		type: Sequelize.STRING,
		allowNull: false
	  },
      position:{
        type: Sequelize.STRING,
		allowNull: true
      },
      school:{
        type: Sequelize.STRING,
		allowNull: true
      },
      address:{
        type: Sequelize.STRING,
		allowNull: true
      },
      paymentmethod: {
		type: Sequelize.STRING,
		allowNull: false
	  },
      slip: {
		type: Sequelize.STRING,
		allowNull: true
	  },
      ticketId: {
		type: Sequelize.STRING,
		allowNull: true
	  },
      userId:{
		type: Sequelize.STRING,
        allowNull: true
      },
	  status:{
		type: Sequelize.STRING,
        allowNull: true
	  },
	  ticketquantity:{
		type: Sequelize.STRING,
        allowNull: true
	  },
	  total:{
		type: Sequelize.STRING,
        allowNull: true
	  },
	});

	// User.associate = (models) => {
    //     User.hasMany(models.Comments, { foreignKey: 'userId',as: 'comments' });
    // };
	return Museum;
  };