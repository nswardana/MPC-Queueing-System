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
      isLoading: false,  // Track loading state for fetching or operations
    };
    this._isMounted = false;  // Track if the component is mounted
  }

  componentDidMount() {
    this._isMounted = true;  // Set to true when component is mounted
    this.refresh();  // Initial data fetch
    // Listen for the 'groomerToggleDuty' event from the socket and refresh data
    this.socket.on('groomerToggleDuty', () => {
      if (this._isMounted) {
        this.refresh();  // Refresh data when this event is triggered
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;  // Set to false when component is unmounted
    if (this.socket) {
      this.socket.off('groomerToggleDuty');  // Clean up event listeners
      this.socket.disconnect();  // Disconnect the socket if no longer needed
    }
  }

  async refresh() {
    this.setState({ isLoading: true });  // Start loading when fetching data
    try {
      const response = await axios.get(`${this.URL}/groomers/getondutygroomers`);
      if (this._isMounted) {
        this.setState({ onDutyGroomers: response.data, isLoading: false });
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState({ isLoading: false });
      }
      console.error('Error fetching on-duty groomers:', error);
    }
  }

  getTicket(groomer) {
    return groomer.ticketNumber ? groomer.ticketNumber.toString().padStart(4, '0') : 'Available';
  }

  getPatient(groomer) {
    if (groomer.patientFirstName) {
      const patient = `${groomer.patientFirstName} ${groomer.patientLastName}`;
      return <React.Fragment><strong className="text-danger">Patient: </strong> {patient}</React.Fragment>;
    }
    return <React.Fragment><strong className="text-danger">Patient: </strong>No patient.</React.Fragment>;
  }

  async nextPatientGroomer(groomerId) {
    this.setState({ isLoading: true });  // Set loading state while performing the operation

    try {
      const result = await axios.post(`${this.URL}/groomers/nextpatient`, { groomerId });
      if (this._isMounted) {
        this.setState({ isLoading: false });
        this.refresh();  // Refresh the list of on-duty groomers
        this.props.refreshTickets();  // Notify parent to refresh ticket list
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState({ isLoading: false });
      }
      console.error('Error in nextPatientGroomer:', error);
    }
  }

  render() {
    const { onDutyGroomers, isLoading } = this.state;

    return (
      <div className="row" style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '5px', marginRight: '5px' }}>
        {isLoading ? (
          <div className="col-12 text-center">
            <ReactLoading type="bars" color="#000" height={50} width={50} />
          </div>
        ) : (
          <>
            {onDutyGroomers.length === 0 ? (
              'No on-duty groomers.'
            ) : (
              onDutyGroomers.map((onDutyGroomer) => (
                <div
                  key={onDutyGroomer.groomerId}
                  className="col-sm-3 card text-center"
                  style={{
                    marginLeft: '5px',
                    marginTop: '5px',
                    padding: '0px',
                    backgroundColor: 'rgba(102, 0, 51, 0.3)',
                  }}
                >
                  <div className="card-body">
                    <h4>{this.getTicket(onDutyGroomer)}</h4>
                    <div className="card-text">
                      <p>
                        <strong className="text-danger">Groomer:</strong> {onDutyGroomer.groomerName}
                      </p>
                      <p>{this.getPatient(onDutyGroomer)}</p>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => this.nextPatientGroomer(onDutyGroomer.groomerId)}
                      disabled={isLoading} // Disable the button while loading
                    >
                      Next Patient
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    );
  }
}

export default OnDutyGroomers;
