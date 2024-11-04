'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    no_hp: DataTypes.STRING,
    message: DataTypes.STRING,
    issent: DataTypes.BOOLEAN
  }, {});
  Message.associate = function(models) {
  };
  return Message;
};
