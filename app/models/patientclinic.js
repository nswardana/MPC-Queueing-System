'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patientclinic = sequelize.define('Patientclinic', {
    no_anggota: DataTypes.STRING,
    nik: DataTypes.STRING,
    rekam_medis: DataTypes.STRING,
    name: DataTypes.STRING,
    gender: DataTypes.TEXT,
    mobile: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    street: DataTypes.STRING
  },  {
    tableName: 'pet_clinic_client',
     // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // If don't want createdAt
    createdAt: false,
    // If don't want updatedAt
    updatedAt: false
  });
  Patientclinic.associate = function(models) {
  };
  return Patientclinic;
};

