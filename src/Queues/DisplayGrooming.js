import React, { Component } from 'react';
import {config} from '../Config/config';
import axios from 'axios';
import io from "socket.io-client";

class DisplayGrooming extends Component {

	constructor(){
		super();
		this.URL = config.URL;
		this.socket=io.connect(this.URL);
		this.state={
			ticketsWithGroomers: []
		};
	}

	async refreshQueue(){
		let ticketsWithGroomers = (await axios.get(`${this.URL}/queues/getticketsWithGroomers`)).data;
		this.setState({
			ticketsWithGroomers
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

	getLatestTicketWithGroomer(){
		let latestTicketWithGroomer = this.state.ticketsWithGroomers[0];
		if(latestTicketWithGroomer){
			return latestTicketWithGroomer;
		}
		return null;
	}

	render(){
		let latestTicketWithGroomer = this.getLatestTicketWithGroomer();
		return(
			<div className="container">
				{/*}
				<div className="row" style={{marginTop: '20px'}}>
					{this.state.ticketsWithDoctors.length===0 && "No patient is currently being attended by doctors."}
					{latestTicketWithGroomer && (
						<div className="col-lg-12 card text-center" style={{height: '250px'}}>
							<div className="card-body">
								<h1 className="text-danger display-4"><strong>{latestTicketWithGroomer.ticketNumber.toString().padStart(4,"0")}</strong></h1>
							</div>
							<div className="card-text">
								<p><strong className="text-danger">Doctor: </strong>{latestTicketWithGroomer.groomer}</p>
								<p><strong className="text-danger">Patient: </strong>{latestTicketWithGroomer.patient}</p>
							</div>
						</div>
					)}
				</div>
				{*/}
				<div className="row" style={{marginBottom:'20px'}}>
				{latestTicketWithGroomer &&
					this.state.ticketsWithGroomers.map(ticketWithGroomer => (
							<div key={ticketWithGroomer.ticketNumber} className="col-sm-3 card text-center" style={{marginTop:'20px',marginLeft:'5px',padding:'0px'}} >
								<div className="card-body">
									<h1 className="text-danger">{ticketWithGroomer.ticketNumber.toString().padStart(4, "0")}</h1>
								</div>
								<div className="card-text">
									<p><strong className="text-danger">Groomer: </strong>{ticketWithGroomer.groomer}</p>
									<p><strong className="text-danger">Patient: </strong>{ticketWithGroomer.patient}</p>
								</div>
							</div>
					))
				}
				</div>
			</div>
		);
	}


}

export default DisplayGrooming;
