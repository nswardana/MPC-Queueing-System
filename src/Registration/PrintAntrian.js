import React, { Component } from 'react';
import './QueueTicket.css';

class PrintAntrian extends Component {
  constructor(props) {
    super(props);
    this.queueNumber = this.props.location.state.data.ticketNumber; // Assuming queue number is coming from props
    this.ticketRef = React.createRef(); // Reference to the part that should be printed
  }

  // Layout of the ticket (content to be printed)
  layout() {
    return (
      <div className="queue-ticket"  ref={this.ticketRef} >
        <div className="ticket-header">
          <h2>Tiket Antrian</h2>
        </div>
        <div className="ticket-body">
          <div className="queue-number">
            <h3>Nomor Antrian</h3>
            <p id="queue-number">#{this.queueNumber < 10 ? `00${this.queueNumber}` : this.queueNumber}</p>
          </div>
        </div>
        <div className="ticket-footer">
          <p>Silakan tunggu panggilan selanjutnya</p>
        </div>      
      </div>
    );
  }

  // Method to handle the print
  handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600'); // Open a new print window
    const content = this.ticketRef.current.innerHTML; // Get the content to print
    printWindow.document.write('<html><head><title>Print Ticket</title>');
    printWindow.document.write('<style>'); // Add styles to the print page
    printWindow.document.write('@media print { body { font-family: Arial, sans-serif; } }'); 
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content); // Write the content to the print window
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print(); // Trigger the print dialog
  };

  render() {
    return (
      <React.Fragment>
        {/* Print Button */}
        
        {/* The content that will be printed */}
        <div className="content">
          {this.layout()}
		  <br></br>
		  <button type="button" className="btn btn-danger" onClick={this.handlePrint} >Print Ticket</button>

        </div>
      </React.Fragment>
    );
  }
}

export default PrintAntrian;
