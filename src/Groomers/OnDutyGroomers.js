import React, {Component} from 'react';
import axios from 'axios';
import {config} from '../Config/config';
import io from "socket.io-client";

class OnDutyGroomers extends Component{

  constructor(){
    super();
    this.URL = config.URL;
    this.socket=io.connect(this.URL);
    this.state = {
        onDutyGroomers: []
    };
  }

  componentDidMount(){
    this.refresh();
    this.socket.on("data_doctorToggleDuty", (data)=>{
      this.refresh();
    });
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
    await axios.post(`${this.URL}/groomers/nextpatient`, {
      groomerId
    });
    this.props.refreshTickets();
    this.refresh();
    this.socket.emit("next_patient",{groomerId});
    */
    
    let dataNext = (await axios.post(`${this.URL}/groomers/nextpatient`, {groomerId})).data;
    this.props.refreshTickets();
    this.refresh();
    console.log("dataNext",dataNext);
    this.socket.emit("next_patient",dataNext.data);

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
                <button className="btn btn-sm btn-primary"
                onClick={()=>this.nextPatientGroomer(onDutyGroomer.groomerId)}
              >Pasien Berikutnya</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default OnDutyGroomers;
