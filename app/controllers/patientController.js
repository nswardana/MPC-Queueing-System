'use strict';
const db = require('../models/index.js');
const Patient = db.Patient;
const Queue = db.Queue;
const Ticket = db.Ticket;
const Message = db.Message;

const io = require('../io/io').getIo();
const home = io.of('/').on('connection', socket=>{
  //console.log("Connected from PATIENT.");
});


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
		message: null,
		data : {}
	};

	if(activeQueue.length>0){
		try{

			console.log("Patient create ");

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
			
			var data = {name,email,mobile,gender,ticketNumber,layanan}

			result.success 	= true;
			result.data 	= data;
			result.message 	= "Patient successfully created.";

			//send message
			var no_hp		= mobile;
			var message		= "Kepada Yth Bpk/Ibu "+name+",\n\nTerima kasih atas kunjungan Anda di Armonia Pet Care. \n\nNo Antrian :  *"+ticketNumber+"* \nLayanan : "+layanan+" \n\nTerima Kasih sudah menunggu \n\nARMONIA PET CARE";
			var issent		= false;

			let saveMassage = await Message.create({
				no_hp,
				message,
				issent
			});
			home.emit("new_patient",data);
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