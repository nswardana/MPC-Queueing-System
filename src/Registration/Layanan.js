import React from 'react';
import { useLocation } from 'react-router-dom';
import DataPatient from '../Registration/DataPatient';
import FormRegistration from './FormRegistration';

const Layanan = () => {
  const location = useLocation(); // Use useLocation hook to access location state

  // Check if location.state is present and handle cases where it's missing
  const patient = location.state || null;

  // Log the passed patient data (optional for debugging)
  console.log("Layanan");
  console.log(patient);

  if (!patient) {
    return (
      <div className="container">
        <h3>No patient data available</h3>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          {/* DataPatient Component */}
          <div className="col-12 col-md-4 card mb-3">
            <DataPatient patient={patient} />
          </div>
          {/* FormRegistration Component */}
          <div className="col-12 col-md-8 card mb-3">
            <FormRegistration patient={patient} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layanan;
