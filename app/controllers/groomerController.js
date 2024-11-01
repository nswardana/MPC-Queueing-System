'use strict';
const db = require('../models/index.js');
const Groomer = db.Groomer;
const Ticket = db.Ticket;
const Queue = db.Queue;
const Patient = db.Patient;
const io = require('../io/io').getIo();
/*
const home = io.of('/').on('connection', socket=>{
  //console.log("Connected from Home page.");
});
*/
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
  //queue.emit("doctorToggleDuty");
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
      console.log("jika ada tiket yang diambil, tiket itu di ubah menjadi update");      
      
      if(groomer.Tickets.length>0){
        let ticket = await Ticket.findByPk(groomer.Tickets[0].id);
        await ticket.update({
          isActive: false
        });
        result.message = "Successfully closed current ticket.";
      }

      console.log("jika tidak ada tiket, cari tiket berikutnya yang layanannya");      

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
          }
        }],
        order: [['ticketNumber', 'ASC']]
      });

      if(nextTicket[0]){
        await groomer.addTicket(nextTicket[0]);
        result.data    = nextTicket[0];
        result.message = "Successfully closed current ticket and moved to the next patient.";
      }
      result.success = true;
      home.emit('next');

    } catch(e){
      result.success = false;
      result.message = e.toString();
    }

    res.send(result);
}
