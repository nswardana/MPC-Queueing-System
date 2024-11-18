import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Config/config';
import io from 'socket.io-client';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'; // Import volume-up icon

class OnDutyGroomers extends Component {
  constructor() {
    super();
    this.URL = config.URL;
    this.socket = io.connect(this.URL);  // Ensure the Socket.IO connection
    this.state = {
      onDutyGroomers: [],
      groomerLoadingStatus: {}, // Track loading state for each groomer
      error: null, // Track any errors
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

  // Safe async method with mounted check
  async refresh() {
    this.setState({ groomerLoadingStatus: {}, error: null });  // Reset all loading states when fetching data
    try {
      const response = await axios.get(`${this.URL}/groomers/getondutygroomers`);
      if (this._isMounted) {
        this.setState({ onDutyGroomers: response.data });
      }
    } catch (error) {
      console.error('Error fetching on-duty groomers:', error);
      if (this._isMounted) {
        this.setState({ error: 'Failed to fetch groomers.' });  // Set error in state
      }
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
    this.setState(prevState => ({
      groomerLoadingStatus: { ...prevState.groomerLoadingStatus, [groomerId]: true } // Set specific groomer loading state to true
    }));

    try {
      const result = await axios.post(`${this.URL}/groomers/nextpatient`, { groomerId });
      if (this._isMounted) {
        this.setState(prevState => ({
          groomerLoadingStatus: { ...prevState.groomerLoadingStatus, [groomerId]: false } // Set specific groomer loading state to false after processing
        }));
        this.refresh();  // Refresh the list of on-duty groomers
        this.props.refreshTickets();  // Notify parent to refresh ticket list
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState(prevState => ({
          groomerLoadingStatus: { ...prevState.groomerLoadingStatus, [groomerId]: false } // Handle error and stop loading
        }));
      }
      console.error('Error in nextPatientGroomer:', error);
    }
  }

  // Function to announce ticket number using SpeechSynthesis API
  announceTicketNumber(ticketNumber) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `Nomor antrian ${ticketNumber.toString().padStart(4, '0')} Silakan masuk`;
    utterance.lang = 'id-ID'; // Set language to Indonesian
    utterance.rate = 1; // Set speech rate (speed)
    utterance.pitch = 1; // Set speech pitch (tone)
    speechSynthesis.speak(utterance); // Speak the utterance
  }

  render() {
    const { onDutyGroomers, groomerLoadingStatus, error } = this.state;

    return (
      <div className="row" style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '5px', marginRight: '5px' }}>
        {error && <div className="alert alert-danger col-12">{error}</div>} {/* Display error if any */}
        {onDutyGroomers.length === 0 ? (
          <div className="col-12 text-center">No on-duty groomers.</div>
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
                     <strong className="text-danger">Groomer:</strong> {onDutyGroomer.groomerName}
                   <p>{this.getPatient(onDutyGroomer)}</p>
               </div>

              <div className="card-footer">
                {groomerLoadingStatus[onDutyGroomer.groomerId] ? (
                  // Show the loading spinner only for the specific groomer that is being processed
                  <div className="col-12 text-center">
                    <ReactLoading type="bars" color="#000" height={30} width={30} />
                  </div>
                ) : (
                  <div className="col-12 text-center">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => this.nextPatientGroomer(onDutyGroomer.groomerId)}
                      disabled={groomerLoadingStatus[onDutyGroomer.groomerId]} // Disable button while loading for that specific groomer
                    >
                      Berikutnya
                    </button>
                    
                    <button 
                   className="btn btn-sm btn-primary ml-2"  // Icon size and color, with marginTop for positioning
                     
                   >
                   <FontAwesomeIcon
                        icon={faVolumeUp} // Use FontAwesome icon
                        style={{ fontSize: '18px', cursor: 'pointer', color: 'white', marginTop: '0px' }} // Icon size and color, with marginTop for positioning
                        onClick={() => this.announceTicketNumber(this.getTicket(onDutyGroomer))} // Call function to announce ticket
                      />
                 </button>

                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
}

export default OnDutyGroomers;
