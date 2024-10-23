import React, { Component } from 'react';
import axios from 'axios';
import {config} from '../Config/config';
import NewGroomer from './NewGroomer';
import AllGroomers from './AllGroomers';
import io from "socket.io-client";

class Groomers extends Component{

	constructor(){
		super();
		this.URL = config.URL;
		this.socket=io.connect(this.URL);
		this.state={
			groomers:[]
		};
	}

	async componentDidMount(){
		this.refresh();
	}

	async refresh(){
		let groomers = (await axios.get(`${this.URL}/groomers/getallgroomers`)).data;
		this.setState({
			groomers
		});
	}

	toggleDuty = async (groomerId) => {
		try{
			let result = (await axios.post(`${this.URL}/groomers/toggleduty`,{
				groomerId
			})).data;

			if(result.success){
				let groomers = [...this.state.groomers];
				for(let i=0; i<groomers.length; i++){
					if(groomers[i].groomerId===groomerId){
						let toggleStatus = groomers[i].onDuty ? false : true;
						groomers[i].onDuty = toggleStatus;
						break;
					}
				}
				this.setState({
					groomers
				});
				this.socket.emit("doctorToggleDuty",{groomerId});
			}
		} catch(e){
			console.log(e);
		}
	}

	render(){
		return (
			<React.Fragment>
				<div className="container">
					<div className="row">
						<div className="col-4 card">
							<NewGroomer refresh={()=>this.refresh()}/>
						</div>
						<div className="col-8 card">
							<AllGroomers
								groomers={this.state.groomers}
								toggleDuty={this.toggleDuty}
								refresh={()=>this.refresh()}
							/>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

}

export default Groomers;
