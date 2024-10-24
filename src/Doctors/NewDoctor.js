import React, { Component } from 'react';
import { config } from '../Config/config.js';
import Select from 'react-select'
import axios from 'axios';

class NewDoctor extends Component{

	constructor(){
		super();
		this.URL = config.URL;
		this.initialState =  {
			name: '',
      		onDuty: true,
			submitDisabled: false,
			resetDisabled: false,
			errorMessages: []
		};
		this.state = this.initialState;
		
	}

	updateName(value){
		//console.log(value);
		this.setState({
			name: value
		});
	}


	async componentDidMount(){
		this.refresh();
	}

	async refresh(){
		let doctorclinics = (await axios.get(`${this.URL}/api/doctorclinic`)).data;
		var doctors = [];
		var i ;
		for(i=0; i < doctorclinics.length; i++){
			var option= {value: doctorclinics[i].name, label: doctorclinics[i].name };
			doctors.push(option);
		}
		//doctors=options;
		this.setState({doctors});

	}
	async submit(){
		this.setState({
		  submitDisabled: true,
		    resetDisabled: true
	    });
		
		let {name, onDuty } = this.state;
	    await axios.post(`${this.URL}/doctors/adddoctor`, {
	      name,
	      onDuty
	    }).then(response => {
	    	this.setState(this.initialState);
	    	this.props.refresh();
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
					<div className="form-group">
						<label htmlFor="doctor" className="text-danger">Doctor</label>
						<Select options={this.state.doctors} onChange={(e) => this.updateName(e.value)} />
					</div>
					
					<div className="form-group">
							<button type="button" className="btn btn-danger"
								onClick={() => this.submit() }
								disabled={this.state.submitDisabled}
							>
							Submit</button>
							
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default NewDoctor;
