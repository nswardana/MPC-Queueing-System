import React, { Component } from 'react';
import {config} from '../Config/config';
import axios from 'axios';
import io from "socket.io-client";

class DisplayQueue extends Component {

	constructor(){
		super();
		this.URL = config.URL;
		this.socket=io.connect(this.URL);
		this.state={
			ticketsWithDoctors: []
		};
	}

	async refreshQueue(){
		let ticketsWithDoctors = (await axios.get(`${this.URL}/queues/getticketswithdoctors`)).data;
		this.setState({
			ticketsWithDoctors
		});
	}

	componentDidMount(){
		this.refreshQueue();
		this.socket.on("data_next_patient", () => {
			this.refreshQueue();
		});
		this.socket.on("closeQueue", ()=>{
			this.refreshQueue();
		});
	}

	getLatestTicketWithDoctor(){
		let latestTicketWithDoctor = this.state.ticketsWithDoctors[0];
		if(latestTicketWithDoctor){
			return latestTicketWithDoctor;
		}
		return null;
	}

	render(){
		let latestTicketWithDoctor = this.getLatestTicketWithDoctor();
		return(
			<div className="container">
				{/*}
				<div className="row" style={{marginTop: '20px'}}>
					{this.state.ticketsWithDoctors.length===0 && "No patient is currently being attended by doctors."}
					{latestTicketWithDoctor && (
						<div className="col-lg-12 card text-center" style={{height: '250px'}}>
							<div className="card-body">
								<h1 className="text-danger display-4"><strong>{latestTicketWithDoctor.ticketNumber.toString().padStart(4,"0")}</strong></h1>
							</div>
							<div className="card-text">
								<p><strong className="text-danger">Doctor: </strong>{latestTicketWithDoctor.doctor}</p>
								<p><strong className="text-danger">Patient: </strong>{latestTicketWithDoctor.patient}</p>
							</div>
						</div>
					)}
				</div>
				{*/}
				<div className="row" style={{marginBottom:'20px'}}>
				{latestTicketWithDoctor &&
					this.state.ticketsWithDoctors.map(ticketWithDoctor => (
							<div key={ticketWithDoctor.ticketNumber} className="col-sm-3 card text-center" style={{marginTop:'20px',marginLeft:'5px',padding:'0px'}}>
								<div className="card-body">
									<h1 className="text-danger">{ticketWithDoctor.ticketNumber.toString().padStart(4, "0")}</h1>
								</div>
								<div className="card-text">
									<p><strong className="text-danger">Doctor: </strong>{ticketWithDoctor.doctor}</p>
									<p><strong className="text-danger">Patient: </strong>{ticketWithDoctor.patient}</p>
								</div>
							</div>
					))
				}
				</div>
			</div>
		);
	}


}

export default DisplayQueue;
