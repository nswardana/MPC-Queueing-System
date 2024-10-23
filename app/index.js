'use strict';
const db = require('./models/index.js');
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const PORT = process.env.PORT || 4002;
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const ioUtil = require('./io/io');
const path = require('path');

/*
const socketIo = require('socket.io');
ioUtil.setIo(socketIo(server));
//const io = ioUtil.getIo();

// Listen for incoming Socket.IO connections
io.on("connection", (socket) => {
 //console.log("User connected ", socket.id); // Log the socket ID of the connected user

  // Listen for "send_message" events from the connected client
  socket.on("send_message", (data) => {
      console.log("Message Received ", data); // Log the received message data
      // Emit the received message data to all connected clients
      io.emit("receive_message", data);
  });
});
*/

// Initialize a new instance of Socket.IO by passing the HTTP server
const { Server } = require("socket.io"); // Import Socket.IO Server class
const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3001",'http://localhost:3000'], // Allow requests from this origin and my frontend port = 5173
      methods: ["GET", "POST"], // Allow these HTTP methods
    },
});
ioUtil.setIo(io);
// Listen for incoming Socket.IO connections
io.on("connection", (socket) => {
    console.log("User connected ", socket.id); // Log the socket ID of the connected user
    // Listen for "send_message" events from the connected client
    socket.on("send_message", (data) => {
        console.log("Message Received ", data); // Log the received message data
        // Emit the received message data to all connected clients
        io.emit("receive_message", data);
    });

    socket.on("new_patient", (data) => {
      console.log("new_patient ", data); // Log the received message data
      // Emit the received message data to all connected clients
      io.emit("new_data_patient", data);
    });

    socket.on("next_patient", (data) => {
      console.log("next_patient ", data); // Log the received message data
      // Emit the received message data to all connected clients
      io.emit("data_next_patient", data);
    });

    socket.on("doctorToggleDuty", (data) => {
      console.log("doctorToggleDuty ", data); // Log the received message data
      // Emit the received message data to all connected clients
      io.emit("data_doctorToggleDuty", data);
    });


    
});


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet())
app.use(cors());
app.use(express.static(path.join(__dirname, "../build")));
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

let patientController = require('./controllers/patientController');
let queueController = require('./controllers/queueController');
let doctorController = require('./controllers/doctorController');
let groomerController = require('./controllers/groomerController');

app.post("/patients/create", patientController.create);
app.get("/queues/gettickets", queueController.getTickets);
app.get("/queues/getactivequeue", queueController.getActiveQueue);
app.get("/queues/getticketswithdoctors", queueController.getTicketsWithDoctors);
app.get("/queues/getticketsWithGroomers", queueController.getTicketsWithGroomers);
app.post("/queues/opennewqueue", queueController.openNewQueue);
app.post("/queues/closeactivequeue", queueController.closeActiveQueue);

app.post("/doctors/adddoctor", doctorController.addDoctor);
app.get("/doctors/getalldoctors", doctorController.getAllDoctors);
app.post("/doctors/toggleduty", doctorController.toggleDuty);
app.get("/doctors/getondutydoctors", doctorController.getOnDutyDoctors);
app.post("/doctors/nextpatient", doctorController.nextPatient);


app.post("/groomers/addgroomer", groomerController.addGroomer);
app.get("/groomers/getallgroomers", groomerController.getAllGroomers);
app.post("/groomers/toggleduty", groomerController.toggleDuty);
app.get("/groomers/getondutygroomers", groomerController.getOnDutyGroomers);
app.post("/groomers/nextpatient", groomerController.nextPatient);

require("./routes/tutorial.routes")(app);
require("./routes/patient.routes")(app);
require("./routes/doctor.routes")(app);
require("./routes/groomer.routes")(app);


// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// start the server
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

