import React, { Component } from 'react';
import { config } from '../Config/config.js';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class DataPatient extends Component{
	constructor(props){
		super(props);
		this.getDataPatient();
	  }

	getDataPatient(){
		console.log("getDataPatient");
		console.log(this.props.patient);
	}
	
	render(){
		return(
			<React.Fragment>
				<div className="container card" style={{marginTop: '20px', marginBottom: '20px'}}>
					<div className="form-group" style={{marginTop: '20px'}}>
						<h4 className="text-danger">DATA</h4>
					</div>
					<div className="form-group">
						<label htmlFor="firstName" className="text-danger"> Name</label>
						: {this.props.patient.name}
					</div>
					<div className="form-group">
						<label htmlFor="lastName" className="text-danger">Email</label>
						: {this.props.patient.email}
					</div>
					<div className="form-group">
						<label className="text-danger">Mobile</label>
						: {this.props.patient.mobile}
					</div>
					<div className="form-group">
						<label className="text-danger">Alamat</label>
						: {this.props.patient.street}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default DataPatient;
