'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tutorial = sequelize.define('Tutorial', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    published: DataTypes.BOOLEAN
  }, {});
  Tutorial.associate = function(models) {
    // associations can be defined here
    //Tutorial.hasMany(models.Ticket, { foreignKey: 'doctorId' });
  };
  return Tutorial;
};
