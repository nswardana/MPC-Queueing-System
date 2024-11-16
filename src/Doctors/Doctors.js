import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Config/config';
import NewDoctor from './NewDoctor';
import AllDoctors from './AllDoctors';
import io from "socket.io-client";

class Doctors extends Component {
  _isMounted = false;  // Flag to track if the component is still mounted

  constructor() {
    super();
    this.URL = config.URL;
   // this.socket = io.connect(this.URL);
    this.state = {
      doctors: []
    };
  }

  async componentDidMount() {
    this._isMounted = true; // Mark component as mounted
    try {
      await this.refresh();
    } catch (error) {
      console.error("Error during componentDidMount:", error);
    }

    // Example of setting up a socket listener (uncomment if you need it)
    // this.socket.on("doctorToggleDuty", (data) => {
    //   this.refresh();
    // });
  }

  componentWillUnmount() {
    this._isMounted = false; // Mark component as unmounted

    // Cleanup socket connection when component is unmounted
    /*
    if (this.socket) {
      this.socket.disconnect();
    }
    */
  }

  async refresh() {
    try {
      const doctors = (await axios.get(`${this.URL}/doctors/getalldoctors`)).data;

      if (this._isMounted) { // Only update state if the component is still mounted
        this.setState({
          doctors
        });
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }

  toggleDuty = async (doctorId) => {
    try {
      const result = (await axios.post(`${this.URL}/doctors/toggleduty`, {
        doctorId
      })).data;

      if (result.success) {
        let doctors = [...this.state.doctors];
        for (let i = 0; i < doctors.length; i++) {
          if (doctors[i].doctorId === doctorId) {
            let toggleStatus = doctors[i].onDuty ? false : true;
            doctors[i].onDuty = toggleStatus;
            break;
          }
        }

        if (this._isMounted) { // Only update state if component is still mounted
          this.setState({
            doctors
          });
        }

        // Emit socket event (uncomment if you need it)
        // this.socket.emit("doctorToggleDuty", { doctorId });
      }
    } catch (e) {
      console.error("Error toggling doctor duty:", e);
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-4 card">
              <NewDoctor refresh={() => this.refresh()} />
            </div>
            <div className="col-8 card">
              <AllDoctors
                doctors={this.state.doctors}
                toggleDuty={this.toggleDuty}
                refresh={() => this.refresh()}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Doctors;
