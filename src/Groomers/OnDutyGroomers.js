import React, {Component} from 'react';
import axios from 'axios';
import {config} from '../Config/config';
import io from "socket.io-client";
import ReactLoading from 'react-loading';

class OnDutyGroomers extends Component{

  constructor(){
    super();
    this.URL = config.URL;
    //this.socket=io.connect(this.URL);
    this.state = {
        onDutyGroomers: [],
        isLoading: false
    };
  }

  componentDidMount(){
    this.refresh();
    this.props.socket.on("groomerToggleDuty", (data)=>{
      this.refresh();
    });
  }

  componentDidUnmount()
	{
		 return () => this.socket.off('groomerToggleDuty');

	}

  async refresh(){
    let onDutyGroomers = (await axios.get(`${this.URL}/groomers/getondutygroomers`)).data;
    this.setState({
        onDutyGroomers
    });
  }

  getTicket(doctor){
    if(doctor.ticketNumber){
      return doctor.ticketNumber.toString().padStart(4, "0");
    } else {
      return "Available";
    }
  }

  getPatient(groomer){
    if(groomer.patientFirstName){
      let patient = groomer.patientFirstName +" "+ groomer.patientLastName;
      return <React.Fragment><strong className="text-danger">Patient: </strong> {patient}</React.Fragment>;
    } else{
      return <React.Fragment><strong className="text-danger">Patient: </strong>No patient.</React.Fragment>
    }
  }


   async nextPatientGroomer(groomerId){
    /*
   
    let dataNext = (await axios.post(`${this.URL}/doctors/nextpatient`, {doctorId})).data;
    this.refresh();
    this.props.refreshTickets();
    console.log("nextPatientDoctor",dataNext);
    this.socket.emit("next_patient",dataNext.data);
  */
             this.setState({
                    isLoading: true
                });


            await axios.post(`${this.URL}/groomers/nextpatient`, {groomerId})
            .then((result) => {

                this.setState({
                    isLoading: false
                });
                this.refresh();
                this.props.refreshTickets();
                console.log("nextPatientGroomer",result);

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            });

  }




  render(){
    return (
      <div className="row" style={{marginTop:'20px', marginBottom:'20px', marginLeft: '5px', marginRight: '5px'}}>
        {this.state.onDutyGroomers.length===0 && 'No on duty groomers.'}
        {this.state.onDutyGroomers.length>0 && this.state.onDutyGroomers.map(onDutyGroomer => (
          <div key={onDutyGroomer.groomerId} className="col-sm-3 card text-center"  style={{marginLeft:'5px',marginTop:'5px',padding:'0px', backgroundColor: "rgba(102, 0, 51, 0.3)"}}>
            <div className="card-body">
              <h4>{this.getTicket(onDutyGroomer)}</h4>
              <div className="card-text">
                <p><strong className="text-danger">Groomer:</strong> {onDutyGroomer.groomerName	}</p>
                <p>{this.getPatient(onDutyGroomer)}</p>
              </div>
                 </div>

            <div className="card-footer" >
                { this.state.isLoading ?<ReactLoading type={"bars"} color={"#000"} height={'20%'} width={'20%'} />: <button className="btn btn-sm btn-danger"
                onClick={()=>this.nextPatientGroomer(onDutyGroomer.groomerId)}
              >Pasien Berikutnya</button> }
                

            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default OnDutyGroomers;
