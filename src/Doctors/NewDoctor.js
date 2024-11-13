import React, { Component } from 'react';
import { config } from '../Config/config.js';
import Select from 'react-select'
import axios from 'axios';
import ReactLoading from 'react-loading';

class NewDoctor extends Component{

	constructor(){
		super();
		this.URL = config.URL;
		this.initialState =  {
			name: '',
      		onDuty: true,
			submitDisabled: true,
			resetDisabled: false,
			errorMessages: [],
			isLoading: false
		};
		this.state = this.initialState;
		
	}

	updateName(value){
		//console.log(value);
		this.setState({
			name: value,
			submitDisabled: false,
		});
	}


	async componentDidMount(){
		this.refresh();
	}

	async refresh(){
		let doctorclinics = (await axios.get(`${this.URL}/api/doctorclinic`)).data;
		var doctors = [];
		var i ;
		this.setState({
			 isLoading:true
		});
		for(i=0; i < doctorclinics.length; i++){
			var option= {value: doctorclinics[i].name, label: doctorclinics[i].name };
			doctors.push(option);
		}
		this.setState({
			isLoading:false
	   	});
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
						
						{ this.state.isLoading ?<ReactLoading type={"bars"} color={"#000"} height={'10%'} width={'10%'} />: 
							<Select options={this.state.doctors} onChange={(e) => this.updateName(e.value)} />

							 }	
											
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
