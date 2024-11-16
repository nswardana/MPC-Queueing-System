import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Config/config';
import io from 'socket.io-client';
import ReactLoading from 'react-loading';

class OnDutyGroomers extends Component {
  constructor() {
    super();
    this.URL = config.URL;
    this.socket = io.connect(this.URL);  // Ensure the Socket.IO connection
    this.state = {
      onDutyGroomers: [],
      isLoading: false,
    };
    this._isMounted = false;  // Track if the component is mounted
  }

  componentDidMount() {
    this._isMounted = true;  // Set to true when component is mounted
    this.refresh();  // Initial data fetch
    this.socket.on('groomerToggleDuty', () => {
      if (this._isMounted) {  // Check if component is still mounted
        this.refresh();  // Refresh data when event occurs
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;  // Set to false when component is unmounted
    if (this.socket) {
      this.socket.off('groomerToggleDuty');  // Clean up event listeners
      this.socket.disconnect();  // Optional: Disconnect the socket if no longer needed
    }
  }

  async refresh() {
    try {
      const response = await axios.get(`${this.URL}/groomers/getondutygroomers`);
      if (this._isMounted) {
        this.setState({ onDutyGroomers: response.data });
      }
    } catch (error) {
      console.error('Error fetching on-duty groomers:', error);
    }
  }

  getTicket(groomer) {
    return groomer.ticketNumber ? groomer.ticketNumber.toString().padStart(4, '0') : 'Available';
  }

  getPatient(groomer) {
    return groomer.patientFirstName
      ? <React.Fragment><strong className="text-danger">Patient: </strong> {groomer.patientFirstName} {groomer.patientLastName}</React.Fragment>
      : <React.Fragment><strong className="text-danger">Patient: </strong>No patient.</React.Fragment>;
  }

  async nextPatientGroomer(groomerId) {
    this.setState({ isLoading: true });

    try {
      const result = await axios.post(`${this.URL}/groomers/nextpatient`, { groomerId });
      if (this._isMounted) {
        this.setState({ isLoading: false });
        this.refresh();  // Refresh data after updating the groomer's patient
        this.props.refreshTickets();  // Notify parent to refresh ticket list
      }
    } catch (error) {
      this.setState({ isLoading: false });
      console.error('Error in nextPatientGroomer:', error);
    }
  }

  render() {
    return (
      <div className="row" style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '5px', marginRight: '5px' }}>
        {this.state.onDutyGroomers.length === 0 && 'No on-duty groomers.'}
        {this.state.onDutyGroomers.length > 0 &&
          this.state.onDutyGroomers.map((onDutyGroomer) => (
            <div key={onDutyGroomer.groomerId} className="col-sm-3 card text-center" style={{ marginLeft: '5px', marginTop: '5px', padding: '0px', backgroundColor: 'rgba(102, 0, 51, 0.3)' }}>
              <div className="card-body">
                <h4>{this.getTicket(onDutyGroomer)}</h4>
                <div className="card-text">
                  <p><strong className="text-danger">Groomer:</strong> {onDutyGroomer.groomerName}</p>
                  <p>{this.getPatient(onDutyGroomer)}</p>
                </div>
              </div>

              <div className="card-footer">
                {this.state.isLoading ? (
                  <ReactLoading type={'bars'} color={'#000'} height={'20%'} width={'20%'} />
                ) : (
                  <button className="btn btn-sm btn-danger" onClick={() => this.nextPatientGroomer(onDutyGroomer.groomerId)}>
                    Next Patient
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default OnDutyGroomers;
