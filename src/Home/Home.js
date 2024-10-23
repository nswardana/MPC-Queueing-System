import React, { Component } from 'react';
import NewPatient from '../Patient/NewPatient';
import DisplayQueue from '../Queues/DisplayQueue';
import DisplayGrooming from '../Queues/DisplayGrooming';


class Home extends Component{
	render(){
		return (<React.Fragment>
			<div className="container">
			  <div className="row">
			    {/*}
				<div className="col-4 card">
			      <NewPatient />
			    </div>
				  {*/}
			    <div className="col-12 card">
			    	<DisplayQueue />
					<DisplayGrooming />
			    </div>
			  </div>
			</div>
			</React.Fragment>
		);
	}

}

export default Home;
