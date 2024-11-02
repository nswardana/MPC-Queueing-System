import React, { Component } from 'react';
import { config } from '../Config/config.js';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./search.css";

import ReactLoading from 'react-loading';


class SearchPatient extends Component{
	constructor(){
		super();
		this.URL = config.URL;
		this.initialState =  {
			no_hp: '',
            errorMessages: [],
            patients:[],
            isLoading: false

		};
		this.state = this.initialState;
       
	}
	updateNohp(value){
		this.setState({
			no_hp: value
		});
	}

	validate(){
		let errorMessages = [];
		if(!this.state.no_hp){
			errorMessages.push("No HP diperlukan");
		}

		this.setState({errorMessages});
		if(errorMessages.length===0){
			this.setState({submitDisabled: false})
		}
	}

   	 async refresh(){
        let patients = (await axios.get(`${this.URL}/doctors/getondutydoctors`)).data;
        this.setState({
            patients
        });
      }
    

	async submit(){
		this.setState({
		  submitDisabled: true,
	      resetDisabled: true,
	      isLoading:true
	    });
		let {no_hp} = this.state;

	    await axios.get(`${this.URL}/api/patientclinic`, { params: { mobile: no_hp } }).then(response => {
			this.handleResult(response.data);
			this.setState({ isLoading:false});
	    }).catch(function(error){
	    	console.log(error);
	    });
	    this.setState({ submitDisabled:false, resetDisabled: false });

	}

	 
	handleResult = (patients) => {
        this.props.onSearchResult(patients);            
    }

	render(){
		return(
			<React.Fragment>
				<div className="container card" style={{marginTop: '20px', marginBottom: '20px'}}>
					<div className="form-group" style={{marginTop: '20px'}}>
						<h4 className="text-danger">Cari Pasien</h4>
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
                    <div className="form-group custom-search">
                        <input type="text" className="form-control custom-search-input" placeholder="Masukan no hp" onBlur={(e) => this.updateNohp(e.target.value)} onChange={(e) => this.updateNohp(e.target.value)}
							value={this.state.no_hp}  onKeyPress={event => {
								if (event.key === 'Enter') {
									this.submit()
								}
							  }}/>
                       
						{ this.state.isLoading ?<ReactLoading type={"bars"} color={"#000"} height={'10%'} width={'10%'} />:  <button type="button" className="custom-search-botton" onClick={() => this.submit() }
								disabled={this.state.submitDisabled} >Search</button>  }

                    </div>
					
				</div>

			</React.Fragment>
		);
	}
}

export default SearchPatient;
