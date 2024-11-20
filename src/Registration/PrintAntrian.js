import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './QueueTicket.css';

const PrintAntrian = () => {
  // Access the location state using the useLocation hook
  const location = useLocation();
  const ticketData = location.state && location.state.data;  // Safely accessing the passed data from navigate
  const queueNumber = ticketData && ticketData.ticketNumber && ticketData.ticketNumber.toString().padStart(4, '0');  // Queue number from state
  const layanan = ticketData && ticketData.layanan;  // Service type from state

  const ticketRef = useRef(); // Reference for the print area

  // Function to get formatted date and time
  const getFormattedDateTime = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',   
      month: 'long',    
      year: 'numeric',  
    });

    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} ${formattedTime}`; // Combine date and time
  };

  // Layout for the print ticket
  const layout = () => {
    return (
      <div className="queue-ticket" ref={ticketRef}>
        <div className="ticket-header">
          <h4>ARMONIA PET CARE</h4>
          <h4>0878-4196-4088</h4>
        </div>
        <div className="ticket-body">
          <div className="queue-number">
            <div>Antrian {layanan}</div>
            <div className="date">{getFormattedDateTime()}</div>
            <p id="queue-number">
              #{queueNumber < 10 ? `00${queueNumber}` : queueNumber}
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
  };

  // Function to handle the print with CSS styles
  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600'); // Open a new window for printing
    const content = ticketRef.current.innerHTML; // Get the content to print

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

  return (
    <React.Fragment>
      {/* Print Button */}
      <div className="content">
        {layout()} {/* Render the ticket layout */}
        <br />
        <button type="button" className="btn btn-danger" onClick={handlePrint}>
          Print Ticket
        </button>
      </div>
    </React.Fragment>
  );
};

export default PrintAntrian;
