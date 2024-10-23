'use strict';
const db = require('../models/index.js');
const Op = db.Sequelize.Op;
const Patientclinic = db.Patientclinic;
const io = require('../io/io').getIo();
/*
const home = io.of('/').on('connection', socket=>{
  //console.log("Connected from Home page.");
});
const queue = io.of('/queue').on('connection', socket=>{
  console.log("Connected from Queue page.");
});
*/

  // Retrieve all Patientclinic from the database.
	exports.findAll = (req, res) => {
  const mobile = req.query.mobile;
  var condition = mobile ? { mobile: { [Op.like]: `%${mobile}%` } } : null;
	//var condition = mobile ? { mobile: `${mobile}` } : null;
  //where: condition, offset: 5, limit: 5 
    Patientclinic.findAll({ where: condition, limit: 50 })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving patient."
        });
      });
  };
  
  // Find a single Patientclinic with an id
  exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Patientclinic.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Tutorial with id=" + id
        });
      });
  };
  