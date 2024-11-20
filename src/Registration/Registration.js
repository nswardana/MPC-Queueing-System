import React, { Component } from 'react';
import ListPatients from '../Patient/ListPatients.js';
import SearchPatient from '../Patient/SearchPatient.js';
import { config } from '../Config/config.js';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import "../Patient/search.css";

class Registration extends Component {
  constructor() {
    super();

    this.URL = config.URL;
    this.initialState = {
      no_hp: '',
      errorMessages: [],
      patients: [],
      patient: {}
    };
    this.state = this.initialState;
  }

  updateNohp(value) {
    this.setState({
      no_hp: value
    });
  }

  handlePatient = (patient) => {
    console.log("Selected patient:", patient);
    this.setState({ patient: patient });
    // Use navigate prop to navigate to the next page
    this.props.navigate('/registration/layanan', { state: patient });
  }

  onSearchResult = (patients) => {
    console.log("Patients found:", patients);
    this.setState({ patients: patients });
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <SearchPatient onSearchResult={this.onSearchResult} />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="container card" style={{ marginTop: '20px', marginBottom: '20px' }}>
                <ListPatients
                  onSelectPatient={this.handlePatient}
                  patients={this.state.patients}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Registration;
