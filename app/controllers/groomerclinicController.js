'use strict';
const db = require('../models/index.js');
const Op = db.Sequelize.Op;
const Groomerclinic = db.Groomerclinic;
const io = require('../io/io').getIo();
/*
const home = io.of('/').on('connection', socket=>{
  //console.log("Connected from Home page.");
});
*/
  // Retrieve all Groomerclinic from the database.
exports.findAll = (req, res) => {
  const mobile = req.query.mobile;
  var condition = mobile ? { mobile: { [Op.like]: `%${mobile}%` } } : null;
 
  
  //var condition = mobile ? { mobile: `${mobile}` } : null;
    Groomerclinic.findAll({ where: condition, limit: 50 })
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
  