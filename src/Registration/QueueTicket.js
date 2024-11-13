import React, { useState, useEffect } from 'react';
import './QueueTicket.css';

const QueueTicket = () => {
  const [queueNumber, setQueueNumber] = useState(1);
  const [status, setStatus] = useState('Menunggu...');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueNumber(prevQueueNumber => prevQueueNumber + 1);
      setStatus(prevQueueNumber => (prevQueueNumber % 2 === 0 ? 'Sedang Dilayani' : 'Menunggu...'));
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval saat komponen di-unmount
  }, [queueNumber]);

  return (
    <div className="queue-ticket">
      <div className="ticket-header">
        <h2>Tiket Antrian</h2>
      </div>
      <div className="ticket-body">
        <div className="queue-number">
          <h3>Nomor Antrian</h3>
          <p id="queue-number">#{queueNumber < 10 ? `00${queueNumber}` : queueNumber}</p>
        </div>
        <div className="queue-status">
          <h3>Status</h3>
          <p id="queue-status" style={{ color: status === 'Sedang Dilayani' ? 'green' : '#fff700' }}>
            {status}
          </p>
        </div>
      </div>
      <div className="ticket-footer">
        <p>Silakan tunggu panggilan selanjutnya</p>
      </div>
    </div>
  );
};

export default QueueTicket;
