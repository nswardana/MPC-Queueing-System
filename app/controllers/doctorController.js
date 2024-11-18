
'use strict';
const db = require('../models/index.js');
const Doctor = db.Doctor;
const Ticket = db.Ticket;
const Queue = db.Queue;
const Patient = db.Patient;
const io = require('../io/io').getIo();

const home = io.of('/').on('connection', socket=>{
   //console.log("Connected from DOCKTOR.");
});
/*
const queue = io.of('/queue').on('connection', socket=>{
  console.log("Connected from Queue page.");
});
*/
exports.addDoctor = async function(req, res){
  let { name, onDuty } = req.body;
  let result = {
    success: false,
    message: null
  };

  try{
    let newDoctor = await Doctor.create({
      name,
      onDuty
    });
    result.success = true;
    result.message = "Successfully added a new doctor.";

  } catch(e){
    result.success = false;
    result.message = e.toString();
  }
  res.send(result);
}

exports.deleteDoctor = async function(req, res) {
  let { doctorId } = req.params; // Get doctorId from request parameters
  let result = {
    success: false,
    message: null
  };

  try {
    // Find the doctor by ID
    let doctor = await Doctor.findByPk(doctorId);
    
    if (!doctor) {
      result.success = false;
      result.message = "Doctor not found.";
      return res.status(404).send(result); // Respond if doctor doesn't exist
    }

    console.log("doctor");
    console.log(doctor);


    /*
    // Check if the doctor has active tickets
    if (doctor.Tickets.length > 0) {
      // Optionally, you can unlink the doctor from any tickets if you don't want to delete the tickets
      await doctor.removeTickets(doctor.Tickets);
    }
    */

    // Delete the doctor from the database
    await doctor.destroy();

    result.success = true;
    result.message = "Successfully deleted the doctor.";
    
    // Emit a socket event notifying clients that a doctor has been deleted (if needed)
    home.emit("doctorDeleted", { doctorId });

  } catch (e) {
    result.success = false;
    result.message = e.toString();
  }

  res.send(result); // Send the result to the client
};


exports.toggleDuty = async function(req, res){

  let { doctorId } = req.body;
  let result = {
    success: false,
    message: null
  };
  
  try {
    let doctor = await Doctor.findByPk(doctorId);
    if(doctor){
      await doctor.update({
        onDuty: !doctor.onDuty
      });
      result.success = true;
      result.message = "Successfull changed doctor on-duty status.";
    } else {
      result.success = false;
      result.message = "Doctor not found.";
    }

  } catch(e){
    result.success = false;
    result.message = e.toString();
  }
  home.emit("doctorToggleDuty");
  res.send(result);
}

exports.getAllDoctors = async function(req, res){
  let doctors = await Doctor.findAll({
    attributes: ['id','name','onDuty'],
    order: [['id']]
  });

  const result = doctors.map(doctor=>{
    return {
      doctorId: doctor.id,
      name: doctor.name,
      onDuty: doctor.onDuty
    }
  });

  res.send(result);
}

exports.getOnDutyDoctors = async function(req, res){
  let doctors = await Doctor.findAll({
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

  const result = doctors.map(doctor =>({
    doctorId: doctor.id,
    doctorName: doctor.name,
    ticketId: doctor.Tickets.length > 0 ? doctor.Tickets[0].id : null,
    ticketNumber: doctor.Tickets.length > 0 ? doctor.Tickets[0].ticketNumber : null,
    patientFirstName: doctor.Tickets.length > 0 ? doctor.Tickets[0].patient.name: null,
    patientLastName: doctor.Tickets.length > 0 ? doctor.Tickets[0].patient.name: null
  }));
  res.send(result);
}

exports.nextPatient = async function(req, res){

    let result = {
      success: false,
      message: null,
      data:{}
    };

    try {
      let { doctorId } = req.body;
      let doctor = await Doctor.findByPk(doctorId, {
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
      console.log("doctor");      
      console.log(doctor);
      //jika ada tiket yang diambil, tiket itu di ubah menjadi update
      if(doctor.Tickets.length>0){
        let ticket = await Ticket.findByPk(doctor.Tickets[0].id);
        await ticket.update({
          isActive: false
        });
        home.emit('close_patient_doctor', {ticketId :doctor.Tickets[0].id});
        result.message = "Successfully closed current ticket.";
      }

     //jika tidak ada tiket, cari tiket berikutnya yang layanannya
     // {'layanan'} 
      let nextTicket = await Ticket.findAll({
        attributes: ['id','ticketNumber'],
        where: {
          layanan:"Rawatjalan",
          isActive: true,
          doctorId: null
        },
        include: [{
          model: Queue,
          as: 'queue',
          attributes: ['id'],
          where: {
            isActive: true
          }
        }],
        order: [['ticketNumber', 'ASC']]
      });

      
      if(nextTicket[0]){
        //masukan tiket no 1 ke dokter yang berjaga
          await doctor.addTicket(nextTicket[0]);
          result.data    = nextTicket[0];
          result.message = "Successfully closed current ticket and moved to the next patient.";

          console.log("nextTicket[0]");      
          console.log(nextTicket[0]);


          console.log(">>>> next_patient_doctor emit");  

          var data ={ 
            doctorId: doctor.id,
            doctorName: doctor.name,
            ticketId: nextTicket[0].id,
            ticketNumber: nextTicket[0].ticketNumber,
            patientFirstName: "",
            patientLastName: ""
          }

      }
      home.emit('next_patient_doctor', {data :data});
      result.success = true;
      //home.emit('next');
      


    } catch(e){
      result.success = false;
      result.message = e.toString();
    }

    res.send(result);
    
}
