'use strict';
module.exports = (sequelize, DataTypes) => {
  const Doctorclinic = sequelize.define('Doctorclinic', {
    name: DataTypes.STRING,
  },  {
    tableName: 'pet_clinic_doctor',
     // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // If don't want createdAt
    createdAt: false,
    // If don't want updatedAt
    updatedAt: false
  });
  Doctorclinic.associate = function(models) {
  };
  return Doctorclinic;
};

