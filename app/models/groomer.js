'use strict';
module.exports = (sequelize, DataTypes) => {
  const Groomer = sequelize.define('Groomer', {
    name: DataTypes.STRING,
    onDuty: DataTypes.BOOLEAN
  }, {});
  Groomer.associate = function(models) {
    // associations can be defined here
   Groomer.hasMany(models.Ticket, { foreignKey: 'groomerId' });
  };
  return Groomer;
};