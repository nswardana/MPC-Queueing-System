import React, { Component } from 'react';

class ListPatients extends Component {
  constructor(props) {
    super(props);
  }

  handleRowClick(patient) {
    console.log(patient);
    this.props.onSelectPatient(patient); // Call the function passed as a prop
  }

  render() {
    return (
      <React.Fragment>
        <table className="table table-striped table-hover table-bordered" style={{ marginTop: '20px', marginBottom: '20px' }}>
          {this.props.patients.length !== 0 && (
            <thead>
              <tr>
                <th className="text-danger">Id</th>
                <th className="text-danger">No Hp</th>
                <th className="text-danger">Name</th>
                <th className="text-danger">Email</th>
                <th className="text-danger">Alamat</th>
              </tr>
            </thead>
          )}
          <tbody>
            {this.props.patients.length === 0 && <tr><td colSpan="5">Pasien tidak ditemukan</td></tr>}
            {this.props.patients.length > 0 &&
              this.props.patients.map(patient => (
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

export default ListPatients;
