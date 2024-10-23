'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    rekam_medis:DataTypes.STRING,
    gender: DataTypes.STRING,
    layanan: DataTypes.STRING,
    street: DataTypes.STRING,
    tanggal: DataTypes.DATEONLY,
    catatan: DataTypes.TEXT
  }, {});
  Patient.associate = function(models) {
    // associations can be defined here
    Patient.hasOne(models.Ticket, { foreignKey: 'patientId' })
  };
  return Patient;
};