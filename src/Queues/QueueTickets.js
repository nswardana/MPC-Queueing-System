import React, { Component } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import ReactLoading from 'react-loading'; // Import ReactLoading component
import { config } from '../Config/config.js';
import axios from 'axios';

class QueueTickets extends Component {

  constructor() {
    super();
    this.URL = config.URL;
    this.state = {
    };
  }



  componentDidMount() {
    // Trigger ticket refresh on component mount
    this.props.refreshTickets();
  }

  // Handle canceling a ticketId
  cancelTicket = async (ticketId) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel ticket #${ticketId}?`);
    if (confirmCancel) {
      try {
        const response = await axios.post(`${this.URL}/queues/closeticket`, {ticketId});
        this.props.refreshTickets();
      } catch (error) {
        console.error('Error canceling ticket:', error);
      }
    }
  }

  render() {
    const { tickets, loading } = this.props; // Destructure tickets and loading state

    return (
      <React.Fragment>
        <table className="table table-striped table-hover table-bordered" style={{ marginTop: '20px', marginBottom: '20px' }} aria-labelledby="queue-tickets">
          <thead>
            <tr>
              <th className="text-danger">Ticket #</th>
              <th className="text-danger">Pasien</th>
              <th className="text-danger">Gender</th>
              <th className="text-danger">Layanan</th>
              <th className="text-danger">Catatan</th>
              <th className="text-danger">Attending Physician</th>
              <th className="text-danger">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* If loading, show a loading spinner */}
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  <ReactLoading type="bars" color="#000" height={50} width={50} />
                </td>
              </tr>
            ) : (
              // If there are no tickets
              tickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    There are no tickets at the moment.
                  </td>
                </tr>
              ) : (
                // If there are tickets, render them
                tickets.map(ticket => (
                  <tr key={ticket.ticketNo}>
                    <td style={{ width: '100px' }}>{ticket.ticketNo.toString().padStart(4, "0")}</td>
                    <td style={{ width: '200px' }}>{ticket.name}</td>
                    <td style={{ width: '75px' }}>{ticket.gender}</td>
                    <td style={{ width: '50px' }}>
                      <span className="badge badge-primary">{ticket.layanan}</span>
                    </td>
                    <td style={{ width: '300px' }}>{ticket.catatan}</td>
                    <td style={{ width: '100px' }}>
                      {ticket.doctor !== "" && <span className="badge badge-success">{ticket.doctor}</span>}
                      {ticket.groomer !== "" && <span className="badge badge-success">{ticket.groomer}</span>}
                    </td>
                    <td style={{ width: '100px' }}>
                      {/* Cancel button */}
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => this.cancelTicket(ticket.ticketId)} // Call cancelTicket on button click
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

// Prop validation
QueueTickets.propTypes = {
  tickets: PropTypes.arrayOf(PropTypes.shape({
    ticketNo: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    layanan: PropTypes.string.isRequired,
    catatan: PropTypes.string.isRequired,
    doctor: PropTypes.string,
    groomer: PropTypes.string,
  })).isRequired,
  loading: PropTypes.bool.isRequired,
  refreshTickets: PropTypes.func.isRequired, // Function to refresh the ticket list
};

export default QueueTickets;
