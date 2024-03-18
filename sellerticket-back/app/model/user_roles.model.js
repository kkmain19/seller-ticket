module.exports = (sequelize, Sequelize) => {
    const UserRoles = sequelize.define('user_roles', {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  
    UserRoles.associate = (models) => {
      UserRoles.hasMany(models.User, { foreignKey: 'userId' });
      UserRoles.hasMany(models.Role, { foreignKey: 'roleId' });
    };
    return UserRoles;
  };