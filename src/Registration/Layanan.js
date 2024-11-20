import React from 'react';
import { useLocation } from 'react-router-dom';
import DataPatient from '../Registration/DataPatient';
import FormRegistration from './FormRegistration';

const Layanan = () => {
  const location = useLocation(); // Use useLocation hook to access location state

  // Log the passed patient data
  console.log("Layanan");
  console.log(location.state);

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-4 card">
            <DataPatient patient={location.state} />
          </div>
          <div className="col-8 card">
            <FormRegistration patient={location.state} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layanan;
