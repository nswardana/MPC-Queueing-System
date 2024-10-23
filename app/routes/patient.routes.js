module.exports = app => {

    const patientclinic = require("../controllers/patientclinicController.js");
    var router = require("express").Router();
    
    // Retrieve all patientclinic
    router.get("/", patientclinic.findAll);
    app.use("/api/patientclinic", router);
  };
  