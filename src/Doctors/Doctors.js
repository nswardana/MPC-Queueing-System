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
    this.state = {
      doctors: [],
      loading: false,  // To manage loading state
      error: null,     // To manage error state
    };
  }

  async componentDidMount() {
    this._isMounted = true; // Mark component as mounted
    try {
      await this.refresh();
    } catch (error) {
      console.error("Error during componentDidMount:", error);
      this.setState({ error: 'Error fetching doctors' });
    }

    // Example of setting up a socket listener (uncomment if you need it)
    // this.socket = io.connect(this.URL);
    // this.socket.on("doctorToggleDuty", (data) => {
    //   this.refresh();
    // });
  }

  componentWillUnmount() {
    this._isMounted = false; // Mark component as unmounted

    // Cleanup socket connection when component is unmounted
    // if (this.socket) {
    //   this.socket.disconnect();
    // }
  }

  async refresh() {
    this.setState({ loading: true });
    try {
      const doctors = (await axios.get(`${this.URL}/doctors/getalldoctors`)).data;
      if (this._isMounted) { // Only update state if component is still mounted
        this.setState({
          doctors,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      if (this._isMounted) {
        this.setState({
          loading: false,
          error: 'Error fetching doctors',
        });
      }
    }
  }

  toggleDuty = async (doctorId) => {
    this.setState({ loading: true });

    try {
      const result = (await axios.post(`${this.URL}/doctors/toggleduty`, {
        doctorId
      })).data;

      if (result.success) {
        let doctors = [...this.state.doctors];
        for (let i = 0; i < doctors.length; i++) {
          if (doctors[i].doctorId === doctorId) {
            doctors[i].onDuty = !doctors[i].onDuty;  // Toggle duty status
            break;
          }
        }

        if (this._isMounted) { // Only update state if component is still mounted
          this.setState({
            doctors,
            loading: false,
          });
        }

        // Emit socket event (uncomment if you need it)
        // this.socket.emit("doctorToggleDuty", { doctorId });
      }
    } catch (e) {
      console.error("Error toggling doctor duty:", e);
      this.setState({
        loading: false,
        error: 'Error toggling doctor duty',
      });
    }
  };

  deleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      this.setState({ loading: true });
      try {
        const result = (await axios.delete(`${this.URL}/doctors/${doctorId}`)).data;

        if (result.success) {
          let doctors = this.state.doctors.filter(doctor => doctor.doctorId !== doctorId);

          if (this._isMounted) {
            this.setState({
              doctors,
              loading: false,
            });
          }

          // Emit socket event if needed
          // this.socket.emit("doctorDeleted", { doctorId });
        }
      } catch (e) {
        console.error("Error deleting doctor:", e);
        this.setState({
          loading: false,
          error: 'Error deleting doctor',
        });
      }
    }
  };

  render() {
    const { doctors, loading, error } = this.state;

    return (
      <React.Fragment>
        <div className="container">
          {loading && <div className="text-center"><p>Loading...</p></div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-4 card">
              <NewDoctor refresh={() => this.refresh()} />
            </div>
            <div className="col-8 card">
              <AllDoctors
                doctors={doctors}
                toggleDuty={this.toggleDuty}
                deleteDoctor={this.deleteDoctor}  // Pass deleteDoctor function
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
