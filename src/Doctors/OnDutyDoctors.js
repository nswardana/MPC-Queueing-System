import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Config/config';
import ReactLoading from 'react-loading';

// Import FontAwesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'; // Import volume-up icon

class OnDutyDoctors extends Component {
  _isMounted = false; // Flag to track component mounting state

  constructor() {
    super();
    this.URL = config.URL;
    this.state = {
      onDutyDoctors: [],
      loadingDoctors: {}, // To track loading state per doctor
      error: null // For error handling
    };
  }

  componentDidMount() {
    this._isMounted = true; // Component is mounted
    this.refresh(); // Fetch the doctors data
    // Listen for the socket event
    this.props.socket.on("doctorToggleDuty", () => {
      if (this._isMounted) {
        this.refresh(); // Refresh data when a doctor toggles their duty status
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

    this.setState({ loadingDoctors: {}, error: null }); // Clear any previous loading states

    try {
      const onDutyDoctors = (await axios.get(`${this.URL}/doctors/getondutydoctors`)).data;
      if (this._isMounted) {
        this.setState({
          onDutyDoctors,
        });
      }
    } catch (error) {
      console.error('Error fetching on-duty doctors:', error);
      if (this._isMounted) {
        this.setState({ error: 'Failed to fetch doctors.' });
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
    this.setState(prevState => ({
      loadingDoctors: { ...prevState.loadingDoctors, [doctorId]: true } // Set loading for the specific doctor
    }));

    try {
      const result = await axios.post(`${this.URL}/doctors/nextpatient`, { doctorId });
      if (this._isMounted) {
        this.setState(prevState => ({
          loadingDoctors: { ...prevState.loadingDoctors, [doctorId]: false } // Set loading to false after processing
        }));
        this.refresh(); // Refresh the doctors list
        this.props.refreshTickets(); // Refresh the tickets list
        console.log("nextPatientDoctor", result);
        this.props.socket.emit("next_patient", result.data.data); // Emit the next patient event via socket
      }
    } catch (error) {
      console.error('Error processing next patient for doctor:', error);
      if (this._isMounted) {
        this.setState(prevState => ({
          loadingDoctors: { ...prevState.loadingDoctors, [doctorId]: false } // Set loading to false on error
        }));
      }
    }
  }

  recall(ticketNumber) {
    console.log(ticketNumber);
    this.props.socket.emit("recall", ticketNumber); // Emit recall event via socket
  }

  // Function to announce ticket number using SpeechSynthesis API and play .wav sound
  announceTicketNumber(ticketNumber,layanan) {
    // Play the "ting tong" sound (WAV file) first
    const audio = new Audio('/start.wav'); // Ensure the WAV file is placed in the 'public' folder
    audio.play();

    // After the WAV sound is played, announce the ticket number
    audio.onended = () => {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = `Nomor antrian ${ticketNumber.toString().padStart(4, '0')} ${layanan} Silakan masuk`;
      utterance.lang = 'id-ID'; // Set language to Indonesian
      utterance.rate = 1; // Set speech rate (speed)
      utterance.pitch = 1; // Set speech pitch (tone)
      speechSynthesis.speak(utterance); // Speak the utterance
    };
  }

  render() {
    const { onDutyDoctors, loadingDoctors, error } = this.state;

    return (
      <div className="row" style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '5px', marginRight: '5px' }}>
        {error && <div className="alert alert-danger col-12">{error}</div>}
        {onDutyDoctors.length === 0 ? (
          <div className="col-12 text-center">No on-duty doctors.</div>
        ) : (
          onDutyDoctors.map(onDutyDoctor => (
            <div key={onDutyDoctor.doctorId} className="col-sm-3 card text-center text-bg-info" style={{ marginTop: '5px', marginLeft: '5px', padding: '0px', backgroundColor: "rgba(0, 102, 51, 0.3)" }}>
              <div className="card-body">
                <h4>{this.getTicket(onDutyDoctor)}</h4>
                <div className="card-text">
                  <span><strong className="text-danger">Dokter:</strong> {onDutyDoctor.doctorName}</span>
                  {this.getPatient(onDutyDoctor)}
                </div>
              </div>

              <div className="card-footer">
                <div className="col-12 text-center">
                  {loadingDoctors[onDutyDoctor.doctorId] ? (
                    // Show loading indicator only for the specific doctor being processed
                    <ReactLoading type={"bars"} color={"#000"} height={30} width={30} />
                  ) : (
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => this.nextPatientDoctor(onDutyDoctor.doctorId)} 
                      disabled={loadingDoctors[onDutyDoctor.doctorId]} // Disable the button when loading
                    >
                      Berikutnya
                    </button>
                    
                  )}

                  {/* Add FontAwesome VolumeUpIcon for announcing ticket number */}
                {onDutyDoctor.ticketNumber && (
                   <button 
                   className="btn btn-sm btn-primary"   style={{  marginLeft: '2px' }} // Icon size and color, with marginTop for positioning
                     
                   >
                   <FontAwesomeIcon
                        icon={faVolumeUp} // Use FontAwesome icon
                        style={{ fontSize: '18px', cursor: 'pointer', color: 'white', marginTop: '0px' }} // Icon size and color, with marginTop for positioning
                        onClick={() => this.announceTicketNumber(onDutyDoctor.ticketNumber,onDutyDoctor.layanan)} // Call function to announce ticket
                      />
                 </button>
                      
                  
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
}

export default OnDutyDoctors;
