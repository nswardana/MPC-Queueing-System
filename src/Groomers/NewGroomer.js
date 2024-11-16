import React, { Component } from 'react';
import { config } from '../Config/config.js';
import Select from 'react-select';
import axios from 'axios';
import io from "socket.io-client";

class NewGroomer extends Component {
  constructor() {
    super();
    this.URL = config.URL;
    this.socket = io.connect(this.URL); // If socket is local to this component, handle cleanup

    this.state = {
      name: '',
      onDuty: true,
      submitDisabled: true,
      resetDisabled: false,
      errorMessages: [],
      groomers: []
    };
  }

  async componentDidMount() {
    this.refresh();
  }

  async refresh() {
    try {
      let groomerclinics = (await axios.get(`${this.URL}/api/groomerclinic`)).data;
      const groomers = groomerclinics.map((clinic) => ({
        value: clinic.name,
        label: clinic.name
      }));
      this.setState({ groomers });
    } catch (error) {
      console.error("Error fetching groomer clinics:", error);
      this.setState({ errorMessages: ['Failed to load groomer clinics.'] });
    }
  }

  updateName(value) {
    this.setState({
      name: value,
      submitDisabled: !value
    });
  }

  async submit() {
    this.setState({
      submitDisabled: true,
      resetDisabled: true
    });

    const { name, onDuty } = this.state;

    try {
      await axios.post(`${this.URL}/groomers/addgroomer`, { name, onDuty });

      this.setState({
        name: '',
        onDuty: true,
        submitDisabled: true,
        resetDisabled: false
      });

      this.props.refresh();
      this.socket.emit("doctorToggleDuty", { name }); // Socket emission
    } catch (error) {
      console.error("Error submitting groomer:", error);
      this.setState({
        errorMessages: ['Failed to add groomer. Please try again.'],
        submitDisabled: false,
        resetDisabled: false
      });
    }
  }

  reset() {
    this.setState({
      name: '',
      onDuty: true,
      submitDisabled: true,
      resetDisabled: false,
      errorMessages: []
    });
  }

  // Cleanup socket on component unmount
  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect(); // Disconnect the socket connection when component unmounts
    }
  }

  render() {
    const { groomers, submitDisabled, resetDisabled, errorMessages } = this.state;

    return (
      <React.Fragment>
        <div className="container card" style={{ marginTop: '20px', marginBottom: '20px' }}>
          {errorMessages.length > 0 && (
            <div className="alert alert-danger">
              {errorMessages.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="groomer" className="text-danger">Groomer</label>
            <Select
              options={groomers}
              onChange={(e) => this.updateName(e ? e.value : '')}
              value={groomers.find((groomer) => groomer.value === this.state.name)}
            />
          </div>

          <div className="form-group">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => this.submit()}
              disabled={submitDisabled}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.reset()}
              disabled={resetDisabled}
            >
              Reset
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewGroomer;
