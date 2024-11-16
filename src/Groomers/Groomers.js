import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Config/config';
import NewGroomer from './NewGroomer';
import AllGroomers from './AllGroomers';
import io from "socket.io-client";

class Groomers extends Component {
  constructor() {
    super();
    this.URL = config.URL;
    this.socket = io.connect(this.URL);
    this.state = {
      groomers: []
    };
    this._isMounted = false;  // Track mount status
  }

  componentDidMount() {
    this._isMounted = true;  // Component is mounted
    this.refresh();  // Fetch groomers
    // Set up socket listener for updates
   
	this.socket.on("groomerToggleDuty", (data) => {
      if (this._isMounted) {
        this.refresh();
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;  // Component will unmount
    // Cleanup socket listeners
    if (this.socket) {
      this.socket.off('groomerToggleDuty');
    }
  }

  // Safe async method with mounted check
  async refresh() {
    if (!this._isMounted) return;  // Don't proceed if component is unmounted

    try {
      const groomers = (await axios.get(`${this.URL}/groomers/getallgroomers`)).data;
      if (this._isMounted) {
        this.setState({ groomers });
      }
    } catch (error) {
      console.error('Error fetching groomers:', error);
    }
  }

  toggleDuty = async (groomerId) => {
    try {
      const result = (await axios.post(`${this.URL}/groomers/toggleduty`, { groomerId })).data;
      
      if (result.success) {
        const groomers = [...this.state.groomers];
        for (let i = 0; i < groomers.length; i++) {
          if (groomers[i].groomerId === groomerId) {
            groomers[i].onDuty = !groomers[i].onDuty;  // Toggle duty status
            break;
          }
        }
        
        if (this._isMounted) {  // Check if component is still mounted before updating state
          this.setState({ groomers });
        }
        // Optionally, emit the socket event to notify the server
        // this.socket.emit("groomerToggleDuty", { groomerId });
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-4 card">
              <NewGroomer refresh={() => this.refresh()} />
            </div>
            <div className="col-8 card">
              <AllGroomers
                groomers={this.state.groomers}
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

export default Groomers;
