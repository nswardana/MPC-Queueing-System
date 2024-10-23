import React, { Component } from 'react';
import { useHistory,withRouter } from "react-router-dom";

class ListPatients extends Component {
  constructor(props){
    console.log(props);
    super(props);
  }

  handleRowClick (patient) {
    console.log(patient);
    this.props.onSelectPatient(patient);  
    this.props.history.push({
      pathname: `/registration/layanan`,
      state: patient
  });
  }
  
  render(){
    return(
      <React.Fragment>
      <table className="table table-striped table-hover table-bordered" style={{marginTop:'20px', marginBottom: '20px'}}>
        {
        this.props.patients.length!==0 &&
        <thead>
          <tr>
            <th className="text-danger">Id</th>
            <th className="text-danger">No Hp</th>
            <th className="text-danger">Name</th>
            <th className="text-danger">Email</th>
            <th className="text-danger">Alamat</th>
          </tr>
        </thead>
         }
        <tbody>
          {this.props.patients.length===0 && <tr><td colSpan="4">Pasien tidak di temukan</td></tr> }
          {this.props.patients.length>0 && this.props.patients.map(patient => (
            <tr key={patient.id} onClick={() => this.handleRowClick(patient)}>
              <td>{patient.id}</td>
              <td>{patient.mobile}</td>
              <td>{patient.name}</td>
              <td>{patient.email}</td>
              <td>{patient.street}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </React.Fragment>
    );
  }
}

export default withRouter(ListPatients);