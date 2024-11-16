import React, { Component } from 'react';
import QueueTickets from './QueueTickets';
import QueueControl from './QueueControl';
import OnDutyDoctors from '../Doctors/OnDutyDoctors';
import OnDutyGroomers from '../Groomers/OnDutyGroomers';

import axios from 'axios';
import { config } from '../Config/config.js';
import socketIOClient from "socket.io-client";
import io from "socket.io-client";

class Queue extends Component {
  constructor() {
    super();
    this.URL = config.URL;
    this.socket = io.connect(this.URL); // Socket connection
    this.state = {
      tickets: [],
      socketConnected: false, // Track socket connection state
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    console.log(this.socket);
    this._isMounted = true;  // Set to true when component is mounted

    // Listen for socket connection and disconnection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.setState({ socketConnected: true });
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.setState({ socketConnected: false });
    });

    // Listen for the "new_patient" event
    this.socket.on("new_patient", (data) => {
      console.log("new_patient", data);
      if (this._isMounted) { // Only update state if component is mounted
        this.refreshTickets();
      }
    });

    // Listen for the "next" event
    this.socket.on("next", () => {
      if (this._isMounted) { // Only update state if component is mounted
        this.refreshTickets();
      }
    });

    // Initial ticket refresh
    this.refreshTickets();
  }

  // Flag to track if the component is mounted
  //_isMounted = false;

  componentWillUnmount() {
    this._isMounted = false; // Component is unmounted, prevent state updates
    console.log('Cleaning up socket listeners');

    // Cleanup socket event listeners
    if (this.socket) {
      this.socket.off('new_patient');
      this.socket.off('next');
      this.socket.disconnect(); // Disconnect the socket when unmounting
    }
  }

  async refreshTickets() {
    try {
      let tickets = (await axios.get(`${this.URL}/queues/gettickets`)).data;
      if (this._isMounted) { // Check if component is still mounted before setting state
        this.setState({
          tickets,
        });
      }
    } catch (error) {
      console.error('Error refreshing tickets:', error);
    }
  }

  getActiveTickets() {
    return this.state.tickets.filter(ticket => ticket.isActive === true).length;
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-2 card">
              <div className="container">
                <div className="row">
                  <QueueControl
                    socket={this.socket}
                    refreshTickets={() => this.refreshTickets()}
                    activeTickets={this.getActiveTickets()}
                    totalTickets={this.state.tickets.length}
                  />
                </div>
              </div>
            </div>
            <div className="col-10 card" style={{ marginLeft: '0px' }}>
              <OnDutyDoctors socket={this.socket} refreshTickets={() => this.refreshTickets()} />
              <OnDutyGroomers socket={this.socket} refreshTickets={() => this.refreshTickets()} />
            </div>
          </div>
          <div className="row">
            <div className="col-12 card" style={{ marginTop: '20px' }}>
              <QueueTickets
                refreshTickets={() => this.refreshTickets()}
                tickets={this.state.tickets}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Queue;
