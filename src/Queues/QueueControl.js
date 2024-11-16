import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Config/config.js';
import socketIOClient from 'socket.io-client';
import ReactLoading from 'react-loading'; // Import ReactLoading

class QueueControl extends Component {
  constructor() {
    super();
    this.URL = config.URL;
    this.state = {
      totalTickets: 0,
      startDate: null,
      hasOpenQueue: false,
      loading: false,  // Add loading state
    };
  }

  componentDidMount() {
    this.refresh(); // Initial data load

    // Listen to socket events for new patients
    this.props.socket.on('newPatient', this.refresh);
  }

  componentWillUnmount() {
    // Cleanup socket listener when component is unmounted
    if (this.props.socket) {
      this.props.socket.off('newPatient');
    }
  }

  // Fetches data for the active queue and updates state
  async refresh() {
    this.setState({ loading: true }); // Set loading to true before starting the refresh process
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
        this.props.refreshTickets(); // Refresh tickets if no active queue
      }
    } catch (error) {
      console.error('Error refreshing queue data:', error);
    } finally {
      this.setState({ loading: false }); // Set loading to false after the data is fetched or an error occurred
    }
  }

  // Opens a new queue
  async openNewQueue() {
    this.setState({ loading: true }); // Set loading to true before opening a new queue
    try {
      await axios.post(`${this.URL}/queues/opennewqueue`);
      this.refresh(); // Refresh after opening a new queue
    } catch (error) {
      console.error('Error opening new queue:', error);
    } finally {
      this.setState({ loading: false }); // Set loading to false after the queue is opened or an error occurred
    }
  }

  // Closes the active queue
  async closeActiveQueue() {
    this.setState({ loading: true }); // Set loading to true before closing the active queue
    try {
      await axios.post(`${this.URL}/queues/closeactivequeue`);
      this.refresh(); // Refresh after closing the active queue
    } catch (error) {
      console.error('Error closing active queue:', error);
    } finally {
      this.setState({ loading: false }); // Set loading to false after the queue is closed or an error occurred
    }
  }

  // Determines which button to render based on the queue state
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

          {/* Display ReactLoading when data is loading */}
          {this.state.loading && (
            <div className="d-flex justify-content-center" style={{ marginTop: '20px' }}>
              <ReactLoading type="spinningBubbles" color="#FF0000" height={'20%'} width={'20%'} />
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
