import React, {Component} from 'react';
import axios from 'axios';
import {config} from '../Config/config';
import io from "socket.io-client";

class OnDutyDoctors extends Component{

  constructor(){
    super();
    this.URL = config.URL;
    this.socket=io.connect(this.URL);
    this.state = {
      onDutyDoctors: []
    };
  }

  componentDidMount(){
  		this.refresh();
      this.socket.on("data_doctorToggleDuty", (data)=>{
        this.refresh();
      });
  }

  async refresh(){
    let onDutyDoctors = (await axios.get(`${this.URL}/doctors/getondutydoctors`)).data;
    this.setState({
      onDutyDoctors
    });
  }

  getTicket(doctor){
    if(doctor.ticketNumber){
      return doctor.ticketNumber.toString().padStart(4, "0");
    } else {
      return "Available";
    }
  }

  getPatient(doctor){
    if(doctor.patientFirstName){
      let patient = doctor.patientFirstName +" "+ doctor.patientLastName;
      return <React.Fragment><strong className="text-danger">Patient: </strong> {patient}</React.Fragment>;
    } else{
      return <React.Fragment><strong className="text-danger">Patient: </strong>No patient.</React.Fragment>
    }
  }

  async nextPatientDoctor(doctorId){
    /*
    await axios.post(`${this.URL}/doctors/nextpatient`, {
      doctorId
    });
    */
    let dataNext = (await axios.post(`${this.URL}/doctors/nextpatient`, {doctorId})).data;
    this.props.refreshTickets();
    this.refresh();
    console.log("nextPatientDoctor",dataNext);
    this.socket.emit("next_patient",dataNext.data);
  }

  render(){
    return (
      <div className="row" style={{marginTop:'20px', marginBottom:'20px', marginLeft: '5px', marginRight: '5px'}}>
        {this.state.onDutyDoctors.length===0 && 'No on duty doctors.'}
        {this.state.onDutyDoctors.length>0 && this.state.onDutyDoctors.map(onDutyDoctor => (
          <div key={onDutyDoctor.doctorId} className="col-sm-3 card text-center text-bg-info"  style={{marginTop:'5px', marginLeft:'5px',padding:'0px',backgroundColor: "rgba(0, 102, 51, 0.3)"}}>
            <div className="card-body">
              <h5>{this.getTicket(onDutyDoctor)}</h5>
              <div className="card-text">
               <span> <strong className="text-danger">Dokter:</strong> {onDutyDoctor.doctorName}</span>
                {this.getPatient(onDutyDoctor)}
              </div>
                 </div>

            <div className="card-footer" >
                <button className="btn btn-sm btn-danger"
                onClick={()=>this.nextPatientDoctor(onDutyDoctor.doctorId)}
              >Pasien Berikutnya</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default OnDutyDoctors;
