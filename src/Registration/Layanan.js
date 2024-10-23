import React, { Component } from 'react';

import DataPatient from '../Registration/DataPatient';
import FormRegistration from './FormRegistration';

class Layanan extends Component{
	constructor(props){
		super(props);
		console.log("Layanan");
		console.log(this.props.location.state);

	}
	render(){
		return (<React.Fragment>
			<div className="container">
			  <div className="row">
			    <div className="col-4 card">
					<DataPatient patient={this.props.location.state}/>
				    </div>
			    	<div className="col-8 card">
					<FormRegistration patient={this.props.location.state} />
			    	</div>
			  </div>
			</div>
			</React.Fragment>
		);
	}

}

export default Layanan;
