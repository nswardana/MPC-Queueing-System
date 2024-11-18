'use strict';
const db = require('../models/index.js');
const Groomer = db.Groomer;
const Ticket = db.Ticket;
const Queue = db.Queue;
const Patient = db.Patient;
const io = require('../io/io').getIo();
const home = io.of('/').on('connection', socket=>{
  //console.log("Connected from GROOMER.");
});

exports.addGroomer = async function(req, res){
  let { name, onDuty } = req.body;
  let result = {
    success: false,
    message: null
  };

  try{
    let newGroomer = await Groomer.create({
      name,
      onDuty
    });
    result.success = true;
    result.message = "Successfully added a new groomer.";

  } catch(e){
    result.success = false;
    result.message = e.toString();
  }
  res.send(result);
}



exports.deleteGroomer = async function(req, res) {
  let { groomerId } = req.params; // Get doctorId from request parameters
  let result = {
    success: false,
    message: null
  };

  try {
    // Find the doctor by ID
    let doctor = await Groomer.findByPk(groomerId);
    
    if (!groomer) {
      result.success = false;
      result.message = "Groomer not found.";
      return res.status(404).send(result); // Respond if doctor doesn't exist
    }

    console.log("groomer");
    console.log(groomer);


    /*
    // Check if the doctor has active tickets
    if (doctor.Tickets.length > 0) {
      // Optionally, you can unlink the doctor from any tickets if you don't want to delete the tickets
      await doctor.removeTickets(doctor.Tickets);
    }
    */

    // Delete the doctor from the database
    await groomer.destroy();

    result.success = true;
    result.message = "Successfully deleted the doctor.";
    
    // Emit a socket event notifying clients that a doctor has been deleted (if needed)
    home.emit("groomerDeleted", { groomerId });

  } catch (e) {
    result.success = false;
    result.message = e.toString();
  }

  res.send(result); // Send the result to the client
};

exports.toggleDuty = async function(req, res){

  let { groomerId } = req.body;
  let result = {
    success: false,
    message: null
  };
  
  try {
    let groomer = await Groomer.findByPk(groomerId);
    if(groomer){
      await groomer.update({
        onDuty: !groomer.onDuty
      });
      result.success = true;
      result.message = "Successfull changed groomer on-duty status.";
    } else {
      result.success = false;
      result.message = "Groomer not found.";
    }

  } catch(e){
    result.success = false;
    result.message = e.toString();
  }
  home.emit("groomerToggleDuty");
  res.send(result);
}

exports.getAllGroomers = async function(req, res){
  let groomers = await Groomer.findAll({
    attributes: ['id','name','onDuty'],
    order: [['id']]
  });

  const result = groomers.map(groomer=>{
    return {
      groomerId: groomer.id,
      name: groomer.name,
      onDuty: groomer.onDuty
    }
  });

  res.send(result);
}

exports.getOnDutyGroomers = async function(req, res){
  let groomers = await Groomer.findAll({
    attributes: ['id','name'],
    where: {
      onDuty: true
    },
    order: [['name']],
    include: [{
      model: Ticket,
      where: {
        isActive: true
      },
      attributes: ['id', 'ticketNumber'],
      required: false,
      include: [{
        model: Queue,
        as: 'queue',
        attributes: ['id'],
        where: {
          isActive: true
        }
      },
      {
        model: Patient,
        as: 'patient',
        attributes: ['name', 'mobile'],
        required: false
      }
    ]
    }]
  });

  const result = groomers.map(groomer =>({
    groomerId: groomer.id,
    groomerName: groomer.name,
    ticketId: groomer.Tickets.length > 0 ? groomer.Tickets[0].id : null,
    ticketNumber: groomer.Tickets.length > 0 ? groomer.Tickets[0].ticketNumber : null,
    patientFirstName: groomer.Tickets.length > 0 ? groomer.Tickets[0].patient.name: null,
    patientLastName: groomer.Tickets.length > 0 ? groomer.Tickets[0].patient.name: null
  }));
  res.send(result);
}

exports.nextPatient = async function(req, res){
    let result = {
      success: false,
      message: null
    };

    try {
      console.log("req.body",req.body);           

      let { groomerId } = req.body;
      let groomer = await Groomer.findByPk(groomerId, {
        include: [{
          model: Ticket,
          attributes: ['id'],
          where: {
            isActive: true,
          },
          required: false,
          include: [{
            model: Queue,
            as: 'queue',
            attribute: ['id'],
            where: {
              isActive: true
            }
          }]
        }]
      });

      console.log("Data groomer");
      console.log("groomerId",groomerId);           
      console.log(groomer);

        //jika ada tiket yang diambil, tiket itu di ubah menjadi update
      console.log(">>>> jika ada tiket yang diambil, tiket itu di close");      
      if(groomer.Tickets.length>0){
        let ticket = await Ticket.findByPk(groomer.Tickets[0].id);
        await ticket.update({
          isActive: false
        });
        result.message = "Successfully closed current ticket.";
        home.emit('close_patient_grooming', {ticketId :groomer.Tickets[0].id});
      }

      console.log(">>>> jika tidak ada tiket, cari tiket berikutnya yang layanannya");      

      //jika tidak ada tiket, cari tiket berikutnya yang layanannya
     // {'layanan'} 
      let nextTicket = await Ticket.findAll({
        attributes: ['id','ticketNumber'],
        where: {
          layanan:"Grooming",
          isActive: true,
          groomerId: null
        },
        include: [{
          model: Queue,
          as: 'queue',
          attributes: ['id'],
          where: {
            isActive: true
          },
        },
        {
          model: Groomer,
          as: 'groomer',
          attributes: ['name']
          
        }
        ],
        order: [['ticketNumber', 'ASC']]
      });

      if(nextTicket[0]){
        await groomer.addTicket(nextTicket[0]);
        result.data    = nextTicket[0];
        result.message = "Successfully closed current ticket and moved to the next patient.";

        var data ={ ticketId: nextTicket[0].id,
            ticketNumber: nextTicket[0].ticketNumber,
            patient: "",
            groomer: groomer.name
        }

      }

      result.success = true;
        //home.emit('next');
      console.log(">>>> next_patient_grooming emit"); 
      console.log(data );  
      
      home.emit('next_patient_grooming', {data :data });

    } catch(e){
      result.success = false;
      result.message = e.toString();
    }

    

    res.send(result);
}
