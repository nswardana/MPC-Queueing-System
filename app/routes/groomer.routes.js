module.exports = app => {

    const groomerclinic = require("../controllers/groomerclinicController.js");
    var router = require("express").Router();
    
    // Retrieve all patientclinic
    router.get("/", groomerclinic.findAll);
    app.use("/api/groomerclinic", router);
  };
  