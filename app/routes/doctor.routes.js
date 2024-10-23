module.exports = app => {

    const doctorclinic = require("../controllers/doctorclinicController.js");
    var router = require("express").Router();
    
    // Retrieve all doctorclinic
    router.get("/", doctorclinic.findAll);
    app.use("/api/doctorclinic", router);
  };
  