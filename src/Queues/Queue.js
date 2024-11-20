// src/Queue/Queue.jsx
import React, { Component } from 'react';
import QueueTickets from './QueueTickets';
import QueueControl from './QueueControl';
import OnDutyDoctors from '../Doctors/OnDutyDoctors';
import OnDutyGroomers from '../Groomers/OnDutyGroomers';

import axios from 'axios';
import { config } from '../Config/config.js';
import io from "socket.io-client";

class Queue extends Component {
  constructor() {
    super();
    this.URL = config.URL;
    this.socket = io.connect(this.URL); // Socket connection
    this.state = {
      tickets: [],
      socketConnected: false, // Track socket connection state
      loading: false,
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    console.log(this.socket);

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
    this.socket.on("new_patient", () => {
      console.log("new_patient event received");
      this.refreshTickets();  // Trigger ticket refresh
    });

    // Listen for the "next" event
    this.socket.on("next", () => {
      console.log("next event received");
      this.refreshTickets();  // Trigger ticket refresh
    });

    // Initial ticket refresh
    this.refreshTickets();
  }

  componentWillUnmount() {
    console.log('Cleaning up socket listeners');
    
    // Cleanup socket event listeners to prevent memory leaks
    if (this.socket) {
      this.socket.off('new_patient');
      this.socket.off('next');
      this.socket.disconnect();  // Disconnect socket when unmounting
    }
  }

  // Refresh tickets list and set loading state
  async refreshTickets() {
    this.setState({ loading: true });  // Set loading to true when fetching data
    try {
      let tickets = await axios.get(`${this.URL}/queues/gettickets`);
      this.setState({ tickets: tickets.data, loading: false });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      this.setState({ loading: false });
    }
  }

  // Get active tickets count
  getActiveTickets() {
    return this.state.tickets.filter(ticket => ticket.isActive === true).length;
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            {/* QueueControl - Only takes up 2 columns on larger screens */}
            <div className="col-12 col-md-2 card">
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

            {/* Main content section */}
            <div className="col-12 col-md-10 card" style={{ marginLeft: '0px' }}>
              <OnDutyDoctors socket={this.socket} refreshTickets={() => this.refreshTickets()} />
              <OnDutyGroomers socket={this.socket} refreshTickets={() => this.refreshTickets()} />
            </div>
          </div>
          <div className="row">
            <div className="col-12 card" style={{ marginTop: '20px' }}>
              {/* Pass loading and tickets to QueueTickets */}
              <QueueTickets tickets={this.state.tickets} loading={this.state.loading} refreshTickets={() => this.refreshTickets()} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Queue;
