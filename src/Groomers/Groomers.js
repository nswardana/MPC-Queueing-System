import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Config/config';
import NewGroomer from './NewGroomer';
import AllGroomers from './AllGroomers';
import io from "socket.io-client";
import ReactLoading from 'react-loading';

class Groomers extends Component {
  constructor() {
    super();
    this.URL = config.URL;
    this.socket = io.connect(this.URL);
    this.state = {
      groomers: [],
      loading: false,
      error: null,
      action: '',
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.refresh();  // Fetch groomers
    this.socket.on("groomerToggleDuty", () => {
      if (this._isMounted) {
        this.refresh();
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.socket) {
      this.socket.off('groomerToggleDuty');
    }
  }

  // Function to refresh the list of groomers
  async refresh() {
    this.setState({ loading: true, error: null, action: 'loading groomers' });

    try {
      const groomers = (await axios.get(`${this.URL}/groomers/getallgroomers`)).data;
      if (this._isMounted) {
        this.setState({ groomers, loading: false, action: '' });
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState({ loading: false, error: "Error fetching groomers. Please try again.", action: '' });
      }
    }
  }

  // Function to toggle the duty status of a groomer
  toggleDuty = async (groomerId) => {
    this.setState({ loading: true, error: null, action: 'toggling duty' });

    try {
      const result = (await axios.post(`${this.URL}/groomers/toggleduty`, { groomerId })).data;

      if (result.success) {
        const groomers = [...this.state.groomers];
        for (let i = 0; i < groomers.length; i++) {
          if (groomers[i].groomerId === groomerId) {
            groomers[i].onDuty = !groomers[i].onDuty;  // Toggle duty status
            break;
          }
        }

        if (this._isMounted) {
          this.setState({ groomers, loading: false, action: '' });
        }

        // Emit the socket event to notify the server
        this.socket.emit("groomerToggleDuty", { groomerId });
      } else {
        throw new Error("Failed to toggle duty status");
      }
    } catch (error) {
      console.log(error);
      if (this._isMounted) {
        this.setState({ loading: false, error: "Failed to update duty status. Please try again.", action: '' });
      }
    }
  };

  // Function to delete a groomer
  deleteGroomer = async (groomerId) => {
    this.setState({ loading: true, error: null, action: 'deleting groomer' });

    try {
      const result = (await axios.delete(`${this.URL}/groomers/delete/${groomerId}`)).data;

      if (result.success) {
        const groomers = this.state.groomers.filter(groomer => groomer.groomerId !== groomerId);
        if (this._isMounted) {
          this.setState({ groomers, loading: false, action: '' });
        }
      } else {
        throw new Error("Failed to delete groomer");
      }
    } catch (error) {
      console.log(error);
      if (this._isMounted) {
        this.setState({ loading: false, error: "Failed to delete groomer. Please try again.", action: '' });
      }
    }
  };

  render() {
    const { groomers, loading, error, action } = this.state;

    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-4 card">
              <NewGroomer refresh={() => this.refresh()} />
            </div>
            <div className="col-8 card">
              {/* Loading spinner */}
              {loading && (
                <div className="text-center">
                  <ReactLoading type="spin" color="#0000ff" height={50} width={50} />
                  <p>{action === 'loading groomers' ? 'Loading groomers...' : action}</p>
                </div>
              )}
              
              {/* Error message */}
              {error && <div className="alert alert-danger">{error}</div>}
              
              <AllGroomers
                groomers={groomers}
                toggleDuty={this.toggleDuty}
                deleteGroomer={this.deleteGroomer} // Passing deleteGroomer as a prop
                refresh={() => this.refresh()}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Groomers;
