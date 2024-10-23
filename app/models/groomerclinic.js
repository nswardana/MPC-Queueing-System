'use strict';
module.exports = (sequelize, DataTypes) => {
  const Groomerlinic = sequelize.define('Groomerclinic', {
    name: DataTypes.STRING,
  },  {
    tableName: 'pet_clinic_groomer',
     // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // If don't want createdAt
    createdAt: false,
    // If don't want updatedAt
    updatedAt: false
  });
  Groomerlinic.associate = function(models) {
  };
  return Groomerlinic;
};

