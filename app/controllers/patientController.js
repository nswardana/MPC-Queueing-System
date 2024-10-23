'use strict';
const db = require('../models/index.js');
const Patient = db.Patient;
const Queue = db.Queue;
const Ticket = db.Ticket;
const io = require('../io/io').getIo();

/*
const home = io.of('/').on('connection', socket=>{
	
	console.log("Patient : User connected ", socket.id); // Log the socket ID of the connected user
	socket.on("send_message", (data) => {
        console.log("Message Received ", data); // Log the received message data
        // Emit the received message data to all connected clients
        home.emit("receive_message", data);
    });

	socket.on('change color', (color) => {
		console.log(color);
		home.emit('change color', color)
	})


});

const queue = io.of('/queue').on('connection', socket=>{
  console.log("Connected from Queue page.");
});
*/
exports.create = async function(req, res){
	let {name, email, mobile, gender,rekam_medis, layanan,street,tanggal,catatan} = req.body;
	let activeQueue = await Queue.findAll({
		where:{
			isActive: true
		},
		include: [{
			model: Ticket
		}]
	});
	let result = {
		success: false,
		message: null
	};
	if(activeQueue.length>0){
		try{
			activeQueue = activeQueue[0];
			let tickets = await activeQueue.getTickets();
			let ticketNumber = tickets.length===0 ? 1 : tickets.length + 1;
			let patient = await Patient.create({
				name,
				email,
				mobile,
				gender,
				rekam_medis,
				layanan,
				street,
				tanggal,
				catatan
			});
			let ticket = await Ticket.create({
				layanan,
				isActive: true,
				ticketNumber
			});
			await ticket.setPatient(patient);
			await ticket.setQueue(activeQueue);
			result.success = true;
			result.message = "Patient successfully created.";

		}
		catch(e){
			result.success = false;
			result.message = e.toString();
		}
	} else {
		result.success = false;
		result.message = "No active queue.";
	}
	res.send(result);

}
