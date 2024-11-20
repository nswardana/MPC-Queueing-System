import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ReactLoading from 'react-loading';
import { config } from '../Config/config.js'; // Assuming you're using config for URL or similar

const FormRegistration = ({ patient }) => {
  const navigate = useNavigate();  // This replaces `this.props.navigate`
  const [layanan, setLayanan] = useState('');
  const [tanggal, setTanggal] = useState(new Date());
  const [catatan, setCatatan] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errors = [];
    if (!layanan) errors.push("Pilih layanan.");
    if (!tanggal) errors.push("Pilih Tanggal.");
    setErrorMessages(errors);
    return errors.length === 0;
  };

  const submit = async () => {
    if (!validate()) return;  // Validation before submitting

    setIsLoading(true);

    // Simulate form submission and navigation logic here
    try {
      // Assuming this is where you would submit the data to the server
      const response = await fetch(`${config.URL}/patients/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: patient.name,
          email: patient.email,
          mobile: patient.mobile,
          gender: patient.gender,
          rekam_medis: patient.rekam_medis,
          street: patient.street,
          layanan,
          tanggal,
          catatan,
        }),
      });

      const result = await response.json();

      if (result.success) {
        navigate('/registration/print', { state: { data: result.data } });
      } else {
        setErrorMessages([result.message]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      setErrorMessages(['Something went wrong. Please try again.']);
      setIsLoading(false);
    }
  };

  return (
    <div className="container card" style={{ marginTop: '20px', marginBottom: '20px' }}>
      <h4 className="text-danger">Pelayanan</h4>

      {/* Error Messages */}
      {errorMessages.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <ul>
            {errorMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Layanan Selection */}
      <div className="form-group">
        <label className="text-danger">Layanan</label>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="layanan"
            value="Grooming"
            onChange={(e) => setLayanan(e.target.value)}
            checked={layanan === 'Grooming'}
          />
          <label className="form-check-label" htmlFor="grooming">Grooming</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="layanan"
            value="Rawatjalan"
            onChange={(e) => setLayanan(e.target.value)}
            checked={layanan === 'Rawatjalan'}
          />
          <label className="form-check-label" htmlFor="rawatjalan">Rawat Jalan</label>
        </div>
      </div>

      {/* Date Picker */}
      <div className="form-group">
        <label className="text-danger">Tanggal</label>
        <DatePicker
          className="form-control"
          selected={tanggal}
          onChange={date => setTanggal(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Pilih Tanggal"
        />
      </div>

      {/* Catatan */}
      <div className="form-group">
        <label className="text-danger">Catatan</label>
        <textarea
          className="form-control"
          rows="2"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="form-group">
        {isLoading ? (
          <ReactLoading type="bars" color="#000" height={50} width={50} />
        ) : (
          <button
            type="button"
            className="btn btn-danger"
            onClick={submit}
            disabled={isLoading}
          >
            SIMPAN
          </button>
        )}
      </div>
    </div>
  );
};

export default FormRegistration;
