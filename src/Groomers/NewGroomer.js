import React, { Component } from 'react';
import { config } from '../Config/config.js';
import Select from 'react-select'
import axios from 'axios';
import io from "socket.io-client";


class NewGroomer extends Component{
	constructor(){
		super();
		this.URL = config.URL;
		this.socket=io.connect(this.URL);

		this.initialState =  {
			name: '',
      		onDuty: true,
			submitDisabled: false,
			resetDisabled: false,
			errorMessages: [],
			submitDisabled: true
		};
		this.state = this.initialState;
		
	}

	updateName(value){
		//console.log(value);
		this.setState({
			name: value,
			submitDisabled: false
		});
	}


	async componentDidMount(){
		this.refresh();
	}

	async refresh(){
		let groomerclinics = (await axios.get(`${this.URL}/api/groomerclinic`)).data;
		var groomers = [];
		var i ;
		for(i=0; i < groomerclinics.length; i++){
			var option= {value: groomerclinics[i].name, label: groomerclinics[i].name };
			groomers.push(option);
		}
		this.setState({groomers});
	}

	async submit(){
		this.setState({
		  submitDisabled: true,
		    resetDisabled: true
	    });
		
		let {name, onDuty } = this.state;
	    await axios.post(`${this.URL}/groomers/addgroomer`, {
	      name,
	      onDuty
	    }).then(response => {
	    	this.setState(this.initialState);
	    	this.props.refresh();
			this.socket.emit("doctorToggleDuty",{name});

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
						<label htmlFor="groomer" className="text-danger">Groomer</label>
						<Select options={this.state.groomers} onChange={(e) => this.updateName(e.value)} />
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

export default NewGroomer;
