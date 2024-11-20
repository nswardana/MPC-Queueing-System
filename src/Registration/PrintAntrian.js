import React, { Component } from 'react';
import './QueueTicket.css';

class PrintAntrian extends Component {
  constructor(props) {
    super(props);
    this.queueNumber = this.props.location.state.data.ticketNumber; // Queue number from props
    this.layanan = this.props.location.state.data.layanan; // Service type from props
    this.ticketRef = React.createRef(); // Reference for the print area

    console.log(this.props.location.state.data); // Logging for debugging
  }

  // Function to get formatted date and time
  getFormattedDateTime = () => {
    const now = new Date();
    
    // Format the date as day, month (name), and year
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',   // Two-digit day (e.g., 20)
      month: 'long',    // Full month name (e.g., November)
      year: 'numeric',  // Full year (e.g., 2024)
    });

    // Format the time as HH:mm
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} ${formattedTime}`; // Combine date and time
  };

  // Layout for the print ticket
  layout() {
    return (
      <div className="queue-ticket" ref={this.ticketRef}>
        <div className="ticket-header">
          <h4>ARMONIA PET CARE</h4>
          <h4>0878-4196-4088</h4>
        </div>
        <div className="ticket-body">
          <div className="queue-number">
            <div>Antrian {this.layanan}</div>
            <div className="date">{this.getFormattedDateTime()}</div>
            <p id="queue-number">
              #{this.queueNumber < 10 ? `00${this.queueNumber}` : this.queueNumber}
            </p>
          </div>
          <p className="queue-keterangan">Hubungi staff kami apabila dalam keadaan gawat darurat</p>
          <p className="queue-keterangan">Nomor Antrian disimpan di loket apotik</p>

        </div>
        <div className="ticket-footer">
          <p>Terima Kasih</p>
        </div>      
      </div>
    );
  }

  // Function to handle the print with CSS styles
  handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600'); // Open a new window for printing
    const content = this.ticketRef.current.innerHTML; // Get the content to print

    // Write content and apply styles
    printWindow.document.write('<html><head><title>Print Ticket</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
      }
      .queue-ticket {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        border: 1px solid #000;
        padding: 10px;
        background-color: #fff;
      }
      .ticket-header h4 {
        text-align: center;
        margin: 0;
      }
      .ticket-body {
        margin-top: 20px;
        text-align: center;
      }
      .queue-number {
        font-size: 24px;
        font-weight: bold;
        margin-top: 10px;
      }
      .ticket-footer {
        text-align: center;
        margin-top: 20px;
      }
      .date {
        margin-top: 5px;
        font-size: 12px;
      }
      .queue-keterangan {
        font-size: 10px;
        margin-top: 10px;
        color: #555;
      }
      @media print {
        body {
          margin: 0;
        }
        .queue-ticket {
          width: 100%;
          max-width: 300px;
          margin: 0;
          padding: 10px;
          border: none;
        }
        .ticket-header h4 {
          font-size: 18px;
        }
        .queue-number {
          font-size: 26px;
        }
        .ticket-footer p {
          font-size: 14px;
        }
      }
    `);
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content); // Insert content into the print window
    printWindow.document.write('</body></html>');
    printWindow.document.close(); // Close the document and trigger the print
    printWindow.print(); // Trigger the print dialog
  };

  render() {
    return (
      <React.Fragment>
        {/* Print Button */}
        <div className="content">
          {this.layout()} {/* Render the ticket layout */}
          <br />
          <button type="button" className="btn btn-danger" onClick={this.handlePrint}>
            Print Ticket
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default PrintAntrian;
