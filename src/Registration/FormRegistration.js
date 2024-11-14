import React, { Component } from 'react';
import { config } from '../Config/config.js';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withRouter } from "react-router-dom";
import ReactLoading from 'react-loading';

class FormRegistration extends Component {
  constructor(props) {
    super(props);
    this.URL = config.URL;
    this.initialState = {
      layanan: '',
      tanggal: new Date(),
      caseDescription: '',
      submitDisabled: false,
      resetDisabled: false,
      errorMessages: [],
      isLoading: false
    };

    this.state = this.initialState;
    this.updateTanggal = this.updateTanggal.bind(this);
    this.isMountedFlag = false; // Flag to track if the component is mounted
  }

  componentDidMount() {
    this.isMountedFlag = true; // Set the flag to true when the component is mounted
  }

  componentWillUnmount() {
    this.isMountedFlag = false; // Set the flag to false when the component is unmounted
  }

  updateLayanan(value) {
    this.setState({
      layanan: value
    });
  }

  updateCatatan(value) {
    this.setState({
      catatan: value
    });
  }

  updateTanggal(value) {
    this.setState({
      tanggal: value
    });
  }

  validate() {
    let errorMessages = [];
    if (!this.state.layanan) {
      errorMessages.push("Pilih layanan.");
    }
    if (!this.state.tanggal) {
      errorMessages.push("Pilih Tanggal.");
    }

    this.setState({ errorMessages });
    return errorMessages.length === 0;
  }

  async submit() {
    if (!this.validate()) {
      return; // Prevent submitting if validation fails
    }

    this.setState({
      submitDisabled: true,
      resetDisabled: true,
      isLoading: true
    });

    let { catatan, tanggal, layanan } = this.state;
    let { name, email, mobile, gender, rekam_medis, street } = this.props.patient;

    try {
      const response = await axios.post(`${this.URL}/patients/create`, {
        name, email, mobile, gender, rekam_medis, layanan, street, tanggal, catatan
      });

      if (this.isMountedFlag) { // Check if the component is still mounted
        this.setState(this.initialState); // Reset the form state
        this.setState({ isLoading: false });

        if (response.data.success) {
          this.props.history.push({
            pathname: `/registration/print`,
            state: { data: response.data.data }
          });
        } else {
          this.setState({
            errorMessages: [response.data.message],
            submitDisabled: false,
            resetDisabled: false,
            isLoading: false
          });
        }
      }
    } catch (error) {
      if (this.isMountedFlag) {
        this.setState({ submitDisabled: false, resetDisabled: false, isLoading: false });
      }
      console.error(error);
    }
  }

  reset() {
    this.setState(this.initialState);
  }

  render() {
    return (
      <React.Fragment>
        <div className="container card" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div className="form-group" style={{ marginTop: '20px' }}>
            <h4 className="text-danger">Pelayanan</h4>
            {this.state.errorMessages.length > 0 && (
              <div className="alert alert-danger" role="alert">
                <ul>
                  {this.state.errorMessages.map((errorMessage, index) => (
                    <li key={index}>{errorMessage}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="text-danger">Layanan</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layanan"
                id="grooming"
                value="Grooming"
                onChange={(e) => this.updateLayanan(e.target.value)}
                checked={this.state.layanan === "Grooming"}
              />
              <label className="form-check-label" htmlFor="grooming">Grooming</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layanan"
                id="rawatjalan"
                value="Rawatjalan"
                onChange={(e) => this.updateLayanan(e.target.value)}
                checked={this.state.layanan === "Rawatjalan"}
              />
              <label className="form-check-label" htmlFor="rawatjalan">Rawat Jalan</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layanan"
                id="vaksin"
                value="Vaksin"
                onChange={(e) => this.updateLayanan(e.target.value)}
                checked={this.state.layanan === "Vaksin"}
              />
              <label className="form-check-label" htmlFor="vaksin">Vaksin</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="layanan"
                id="obatcacing"
                value="Obatcacing"
                onChange={(e) => this.updateLayanan(e.target.value)}
                checked={this.state.layanan === "Obatcacing"}
              />
              <label className="form-check-label" htmlFor="obatcacing">Obat Cacing</label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tanggal" className="text-danger">Tanggal</label>
            <DatePicker
              className="form-control"
              id="tanggal"
              placeholderText="Pilih Tanggal"
              onChange={this.updateTanggal}
              selected={this.state.tanggal}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="form-group">
            <label htmlFor="catatan" className="text-danger">Catatan</label>
            <textarea
              className="form-control"
              id="catatan"
              rows="2"
              onBlur={(e) => this.updateCatatan(e.target.value)}
              onChange={(e) => this.updateCatatan(e.target.value)}
              value={this.state.catatan}
            />
          </div>

          <div className="form-group">
            {this.state.isLoading ? (
              <ReactLoading type="bars" color="#000" height={50} width={50} />
            ) : (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => this.submit()}
                disabled={this.state.submitDisabled}
              >
                SIMPAN
              </button>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(FormRegistration);
