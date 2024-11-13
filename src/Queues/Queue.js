import React, { Component } from 'react';
import QueueTickets from './QueueTickets';
import QueueControl from './QueueControl';
import OnDutyDoctors from '../Doctors/OnDutyDoctors';
import OnDutyGroomers from '../Groomers/OnDutyGroomers';

import axios from 'axios';
import { config } from '../Config/config.js';
import socketIOClient from "socket.io-client";
import io from "socket.io-client";

class Queue extends Component{

	constructor(){
		super();
		this.URL = config.URL;
		this.socket=io.connect(this.URL);
		this.state = ({
			tickets: []
		});
	}

	componentDidMount(){
		console.log('componentDidMount');
		console.log(this.socket);
		
		this.socket.on("new_patient", (data) => {
			console.log("new_patient"); // Log the received message data to the console
			console.log(data); // Log the received message data to the console
			this.refreshTickets();
		});

		this.socket.on("next_patient_grooming", (data) => {
			console.log("next_patient_grooming"); // Log the received message data to the console
			console.log(data); // Log the received message data to the console
			this.refreshTickets();
		});

		this.socket.on("next_patient_doctor", (data) => {
			console.log("next_patient_doctor"); // Log the received message data to the console
			console.log(data); // Log the received message data to the console
			this.refreshTickets();
		});


	}

	componentDidUnmount()
	{
		 return () => this.socket.off('new_patient');

	}

	async refreshTickets(){
		let tickets = (await axios.get(`${this.URL}/queues/gettickets`)).data;
		this.setState({
			tickets
		});
	}

	getActiveTickets(){
		let activeTickets = this.state.tickets.map(ticket=>{
			return ticket.isActive === true;
		}).length;
		return activeTickets;
	}

	render(){
		return (
			<React.Fragment>
			<div className="container">
				<div className="row">
					<div className="col-2 card">
						<div className="container">
							<div className="row">
								<QueueControl
									refreshTickets={() => this.refreshTickets()}
									activeTickets={this.getActiveTickets()}
									totalTickets={this.state.tickets.length}/>
							</div>
						</div>
					</div>
					<div className="col-10 card" style={{marginLeft:'0px'}}>
						<OnDutyDoctors socket={this.socket} refreshTickets={() => this.refreshTickets()}/>
						<OnDutyGroomers socket={this.socket} refreshTickets={() => this.refreshTickets()}/>
					</div>
				</div>
				<div className="row">
					<div className="col-12 card" style={{marginTop:'20px'}}>
						<QueueTickets
							refreshTickets={() => this.refreshTickets()}
							tickets={this.state.tickets}
						/>
					</div>
				</div>
			</div>
			</React.Fragment>
		);
	}
}
export default Queue;
