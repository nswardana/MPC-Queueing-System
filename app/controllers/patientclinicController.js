'use strict';
const db = require('../models/index.js');
const Op = db.Sequelize.Op;
const Patientclinic = db.Patientclinic;
const io = require('../io/io').getIo();

// Retrieve all Patientclinic from the database.
exports.findAll = (req, res) => {
  const keyword = req.query.keyword || ''; // Default to empty string if no keyword is provided
  let condition = {};

  // Add condition for searching by mobile or name if the keyword is provided
  if (keyword) {
    condition = {
      [Op.or]: [
        { mobile: { [Op.like]: `%${keyword}%` } },
        { name: { [Op.like]: `%${keyword}%` } },  // Assuming there's a 'name' field
      ],
    };
  }

  Patientclinic.findAll({
    where: condition,
    limit: 50, // Limit results to 50
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving patients."
      });
    });
};

// Find a single Patientclinic by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Patientclinic.findByPk(id)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: `Patientclinic not found with id=${id}`
        });
      }
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Patientclinic with id=" + id
      });
    });
};
