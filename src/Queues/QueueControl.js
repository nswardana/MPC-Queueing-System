import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Config/config.js';
import socketIOClient from 'socket.io-client';

class QueueControl extends Component {
  constructor() {
    super();
    this.URL = config.URL;
    this.state = {
      totalTickets: 0,
      startDate: null,
      hasOpenQueue: false,
    };
    this._isMounted = false; // Track whether the component is mounted
  }

  componentDidMount() {
    this._isMounted = true; // Mark component as mounted
    this.refresh(); // Initial data load
    // Listen to socket events if the component is mounted
    this.props.socket.on('newPatient', this.refresh);
  }

  componentWillUnmount() {
    this._isMounted = false; // Mark component as unmounted
    if (this.props.socket) {
      this.props.socket.off('newPatient'); // Clean up socket listener to avoid memory leak
    }
  }

  async refresh() {
    if (!this._isMounted) return; // Ensure component is mounted before setting state

    try {
      const activeQueue = (await axios.get(`${this.URL}/queues/getactivequeue`)).data;
      if (activeQueue.length) {
        const queue = activeQueue[0];
        this.setState({
          hasOpenQueue: true,
          totalTickets: queue.Tickets.length,
          startDate: queue.startDate,
        });
      } else {
        this.setState({
          hasOpenQueue: false,
          totalTickets: 0,
          startDate: null,
        });
        this.props.refreshTickets(); // If no active queue, refresh tickets
      }
    } catch (error) {
      console.error('Error refreshing queue data:', error);
    }
  }

  async openNewQueue() {
    try {
      await axios.post(`${this.URL}/queues/opennewqueue`);
      this.refresh();
    } catch (error) {
      console.error('Error opening new queue:', error);
    }
  }

  async closeActiveQueue() {
    try {
      await axios.post(`${this.URL}/queues/closeactivequeue`);
      this.refresh();
    } catch (error) {
      console.error('Error closing active queue:', error);
    }
  }

  getButton() {
    return this.state.hasOpenQueue ? (
      <button type="button" onClick={() => this.closeActiveQueue()} className="btn btn-danger">
        Close Queue
      </button>
    ) : (
      <button type="button" onClick={() => this.openNewQueue()} className="btn btn-danger">
        Open New Queue
      </button>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="card" style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
          {!this.state.hasOpenQueue && (
            <div className="alert alert-danger">
              No queue is currently open. Click <em>Open New Queue</em> to start.
            </div>
          )}
          <div className="card-header text-danger">Queue Control</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <span className="text text-danger"> Active Tickets: </span>
              <span className="text">{this.props.activeTickets}</span>
            </li>
            <li className="list-group-item">
              <span className="text text-danger"> Total Tickets: </span>
              <span className="text">{this.state.totalTickets}</span>
            </li>
            <li className="list-group-item">
              <span className="text text-danger"> Date/Time Started: </span>
              <span className="text">{this.state.startDate}</span>
            </li>
          </ul>
          <div className="card-body">{this.getButton()}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default QueueControl;
