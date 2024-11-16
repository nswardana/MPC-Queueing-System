import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Config/config';
import io from "socket.io-client";
import ReactLoading from 'react-loading';

class OnDutyDoctors extends Component {

  _isMounted = false; // Flag to track component mounting state

  constructor() {
    super();
    this.URL = config.URL;
    this.state = {
      onDutyDoctors: [],
      isLoading: true // Initial loading state
    };
  }

  componentDidMount() {
    this._isMounted = true; // Component is mounted
    this.refresh(); // Fetch the doctors data
    // Listen for the socket event
    this.props.socket.on("doctorToggleDuty", () => {
      if (this._isMounted) {
        this.refresh(); // Refresh data when a doctor toggles duty
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false; // Component will unmount
    // Clean up socket listeners to avoid memory leaks
    if (this.props.socket) {
      this.props.socket.off('doctorToggleDuty');
    }
  }

  // Safe async method with mounted check
  async refresh() {
    if (!this._isMounted) return; // Don't continue if component is unmounted

    this.setState({ isLoading: true }); // Set loading state to true while fetching data

    try {
      const onDutyDoctors = (await axios.get(`${this.URL}/doctors/getondutydoctors`)).data;
      if (this._isMounted) {
        this.setState({
          onDutyDoctors,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error fetching on-duty doctors:', error);
      if (this._isMounted) {
        this.setState({ isLoading: false });
      }
    }
  }

  getTicket(doctor) {
    if (doctor.ticketNumber) {
      return doctor.ticketNumber.toString().padStart(4, '0');
    } else {
      return 'Available';
    }
  }

  getPatient(doctor) {
    if (doctor.patientFirstName) {
      let patient = `${doctor.patientFirstName} ${doctor.patientLastName}`;
      return (
        <React.Fragment>
          <strong className="text-danger">Patient: </strong>{patient}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <strong className="text-danger">Patient: </strong>No patient.
        </React.Fragment>
      );
    }
  }

  async nextPatientDoctor(doctorId) {
    this.setState({ isLoading: true }); // Set loading state during async operation

    try {
      const result = await axios.post(`${this.URL}/doctors/nextpatient`, { doctorId });
      if (this._isMounted) {
        this.setState({ isLoading: false }); // Stop loading once the operation is complete
        this.refresh(); // Refresh the doctors list
        this.props.refreshTickets(); // Refresh the tickets list
        console.log("nextPatientDoctor", result);
        this.props.socket.emit("next_patient", result.data.data); // Emit the next patient event via socket
      }
    } catch (error) {
      console.error('Error processing next patient for doctor:', error);
      if (this._isMounted) {
        this.setState({ isLoading: false }); // Stop loading on error
      }
    }
  }

  recall(ticketNumber) {
    console.log(ticketNumber);
    this.props.socket.emit("recall", ticketNumber); // Emit recall event via socket
  }

  render() {
    return (
      <div className="row" style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '5px', marginRight: '5px' }}>
        {this.state.isLoading ? (
          // Display ReactLoading spinner when loading data
          <div className="col-12 text-center">
            <ReactLoading type={"spin"} color={"#000"} height={50} width={50} />
          </div>
        ) : (
          // When data is loaded, display the on-duty doctors
          <>
            {this.state.onDutyDoctors.length === 0 && 'No on-duty doctors.'}
            {this.state.onDutyDoctors.length > 0 &&
              this.state.onDutyDoctors.map(onDutyDoctor => (
                <div key={onDutyDoctor.doctorId} className="col-sm-3 card text-center text-bg-info" style={{ marginTop: '5px', marginLeft: '5px', padding: '0px', backgroundColor: "rgba(0, 102, 51, 0.3)" }}>
                  <div className="card-body">
                    <h5>{this.getTicket(onDutyDoctor)}</h5>
                    <div className="card-text">
                      <span><strong className="text-danger">Dokter:</strong> {onDutyDoctor.doctorName}</span>
                      {this.getPatient(onDutyDoctor)}
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="btn btn-sm btn-danger" onClick={() => this.nextPatientDoctor(onDutyDoctor.doctorId)}>
                      Berikutnya
                    </button>
                    {onDutyDoctor.ticketNumber ? (
                      <button className="btn btn-sm btn-warning" onClick={() => this.recall(onDutyDoctor.ticketNumber)}>
                        Recall
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    );
  }
}

export default OnDutyDoctors;
