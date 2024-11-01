import React, { Component } from 'react';
import { config } from '../Config/config.js';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory,withRouter } from "react-router-dom";
import io from "socket.io-client";

class FormRegistration extends Component{
	constructor(props){
		super(props);
		this.URL = config.URL;
		this.socket=io.connect(this.URL);
		this.initialState =  {
			layanan: '',
			tanggal: new Date(),
			caseDescription: '',
			submitDisabled: false,
			resetDisabled: false,
			errorMessages: [],
		};
		this.state = this.initialState;
		this.updateTanggal = this.updateTanggal.bind(this);
		this._isMounted = false; // Flag untuk mengecek status kompon
	}

	componentDidMount() {
        this._isMounted = true;
     }

	 componentWillUnmount() {
        this._isMounted = false; // Set flag ke false saat komponen di-unmount
    }


	updateLayanan(value){
		this.setState({
			layanan: value
		});
		//this.validate();
	}

	updateCatatan(value){
		this.setState({
			catatan: value
		});
	}
	updateTanggal(value){
		this.setState({
			tanggal: value
		});
		//this.validate();
	}

	validate(){
		let errorMessages = [];
		if(!this.state.layanan){
			errorMessages.push("Pilih layanan.");
		}
		if(!this.state.tanggal){
			errorMessages.push("Pilih Tanggal.");
		}

		this.setState({errorMessages});
		if(errorMessages.length===0){
			//this.setState({submitDisabled: false})
		}
	}

	async submit(){
		let errorMessages = [];
		this.setState({
		  submitDisabled: true,
	      resetDisabled: true
	    });
		
		let {catatan, tanggal, layanan } = this.state;
		let {name, email, mobile, gender,rekam_medis,street} = this.props.patient;
	    await axios.post(`${this.URL}/patients/create`, {
			name, email, mobile, gender,rekam_medis, layanan,street,tanggal,catatan
	    }).then(response => {
			console.log(response);
	    	this.setState(this.initialState);
			if(response.data.success)
			{
				this.socket.emit("new_patient",this.props.patient);
				this.props.history.push({
					pathname: `/registration`
				});
			}else
			{
				errorMessages.push(response.data.message);
				this.setState({errorMessages});
			}

	    }).catch(function(error){
	    	console.log(error);
	    });
	    this.setState({ submitDisabled:false, resetDisabled: false });

	}

	reset(){
		this.setState(this.initialState);
	}

	render(){
		return(
			<React.Fragment>
				<div className="container card" style={{marginTop: '20px', marginBottom: '20px'}}>
					<div className="form-group" style={{marginTop: '20px'}}>
						<h4 className="text-danger">Pelayanan</h4>
						{ this.state.errorMessages.length > 0 &&
						<div className="alert alert-danger" role="alert">
							{ this.state.errorMessages.map(errorMessage =>(
								<li key={errorMessage}>
									{errorMessage}
								</li>
							)
							)}
						</div>
						}
					</div>
	
					<div className="form-group">
						<label className="text-danger">Layanan</label>
					</div>
					<div className="form-group">
					<div className="form-check form-check-inline">
						<input className="form-check-input" type="radio" name="layanan" id="grooming" value="Grooming"
							onChange={(e) => this.updateLayanan(e.target.value)}
							checked={this.state.layanan==="Grooming"}
						/>
						<label className="form-check-label" htmlFor="grooming">
						Grooming
						</label>
					</div>
					<div className="form-check form-check-inline">
						<input className="form-check-input" type="radio" name="layanan" id="rawatjalan" value="Rawatjalan"
							onChange={(e) => this.updateLayanan(e.target.value)}
							checked={this.state.layanan==="Rawatjalan"}
						/>
						<label className="form-check-label" htmlFor="rawatjalan">
						Rawat Jalan
						</label>
					</div>
					<div className="form-check form-check-inline">
						<input className="form-check-input" type="radio" name="layanan" id="vaksin" value="Vaksin"
							onChange={(e) => this.updateLayanan(e.target.value)}
							checked={this.state.layanan==="Vaksin"}
						/>
						<label className="form-check-label" htmlFor="vaksin">
						Vaksin
						</label>
					</div>
					<div className="form-check form-check-inline">
						<input className="form-check-input" type="radio" name="layanan" id="obatcacing" value="Obatcacing"
							onChange={(e) => this.updateLayanan(e.target.value)}
							checked={this.state.layanan==="Obatcacing"}
						/>
						<label className="form-check-label" htmlFor="obatcacing">
						Obatcacing
						</label>
					</div>
					</div>
					<div className="form-group">
						<label htmlFor="tanggal" className="text-danger">Tanggal</label>
					</div>
					<div className="form-group">
						<DatePicker
							className="form-control"
							id="birthday" placeholder="Tanggal"
							onChange={this.updateTanggal}
							selected={this.state.tanggal}
							dateFormat="yyyy-MM-dd"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="catatan" className="text-danger">Catatan</label>
						<textarea className="form-control" id="catatan" rows="2"
							onBlur={(e) => this.updateCatatan(e.target.value)}
							onChange={(e) => this.updateCatatan(e.target.value)}
							value={this.state.catatan}
						>
						</textarea>
					</div>
					<div className="form-group">
							<button type="button" className="btn btn-danger"
								onClick={() => this.submit() }
								disabled={this.state.submitDisabled}
							>
							SIMPAN</button>
							
					</div>
				</div>

			</React.Fragment>
		);
	}
}

export default withRouter(FormRegistration);