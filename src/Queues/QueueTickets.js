import React, { Component } from 'react';
import { config } from '../Config/config.js';
import ReactLoading from 'react-loading'; // Import ReactLoading component

class QueueTickets extends Component {
  componentDidMount() {
    // Trigger ticket refresh on component mount
    this.props.refreshTickets();
  }

  render() {
    const { tickets, loading } = this.props; // Destructure tickets and loading state

    return (
      <React.Fragment>
        <table className="table table-striped table-hover table-bordered" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th className="text-danger">Ticket #</th>
              <th className="text-danger">Pasien</th>
              <th className="text-danger">Gender</th>
              <th className="text-danger">Layanan</th>
              <th className="text-danger">Catatan</th>
              <th className="text-danger">Attending Physician</th>
            </tr>
          </thead>
          <tbody>
            {/* If loading, show a loading spinner */}
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  <ReactLoading type="bars" color="#000" height={50} width={50} />
                </td>
              </tr>
            ) : (
              // If there are no tickets
              tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
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
                      {ticket.doctor !== "-" && <span className="badge badge-success">{ticket.doctor}</span>}
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

export default QueueTickets;
