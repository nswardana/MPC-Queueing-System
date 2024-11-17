import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCog, faSignOutAlt, faList, faUserMd } from '@fortawesome/free-solid-svg-icons'; // Add more icons
import './IconMenu.css'; // Import your custom styles
import { withRouter } from 'react-router-dom'; // Import withRouter HOC

class Home extends Component {
  // Define the icon data as an array of objects
  menuItems = [
    { icon: faHome, label: 'Home', action: '/' },
    { icon: faUser, label: 'Pendaftaran', action: '/registration' },
    { icon: faList, label: 'Antrian', action: '/queue' }, // Updated icon
    { icon: faUserMd, label: 'Dokter', action: '/doctors' } // Updated icon
  ];

  menuItems2 = [
    { icon: faUser, label: 'Groomer', action: '/groomers' }, // Updated icon
    { icon: faSignOutAlt, label: 'Logout', action: '/logout' },
  ];

  // Method to handle icon click actions
  handleClick = (action) => {
    this.props.history.push(action); // Use this.props.history.push() for navigation in v5
  };

  render() {
    return (
      <div className="icon-menu">
        <div className="row">
          {this.menuItems.map((item, index) => (
            <div key={index} className="col-12 col-md-3">
              <div className="card menu-card" onClick={() => this.handleClick(item.action)}>
                <div className="card-body text-center">
                  <FontAwesomeIcon icon={item.icon} size="3x" />
                  <h5 className="card-title">{item.label}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
		<br></br>
		<div className="row">
          {this.menuItems2.map((item, index) => (
            <div key={index} className="col-12 col-md-3">
              <div className="card menu-card" onClick={() => this.handleClick(item.action)}>
                <div className="card-body text-center">
                  <FontAwesomeIcon icon={item.icon} size="3x" />
                  <h5 className="card-title">{item.label}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(Home); // Wrap the component with withRouter to inject history prop
