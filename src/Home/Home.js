import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCog, faSignOutAlt, faList, faUserMd } from '@fortawesome/free-solid-svg-icons'; // Add more icons
import './IconMenu.css'; // Import your custom styles
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Home = () => {
  const navigate = useNavigate(); // Get the navigate function

  // Define the icon data as an array of objects
  const menuItems = [
    { icon: faHome, label: 'Home', action: '/' },
    { icon: faUser, label: 'Pendaftaran', action: '/registration' },
    { icon: faList, label: 'Antrian', action: '/queue' }, // Updated icon
    { icon: faUserMd, label: 'Dokter', action: '/doctors' } // Updated icon
  ];

  const menuItems2 = [
    { icon: faUser, label: 'Groomer', action: '/groomers' }, // Updated icon
    { icon: faSignOutAlt, label: 'Logout', action: '/logout' },
  ];

  // Method to handle icon click actions
  const handleClick = (action) => {
    navigate(action); // Use navigate function from useNavigate hook
    if(action==="/logout")
    {
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login'; // Redirect to login after logout
    }
  };

  return (
    <div className="icon-menu">
      <div className="row">
        {menuItems.map((item, index) => (
          <div key={index} className="col-12 col-md-3">
            <div className="card menu-card" onClick={() => handleClick(item.action)}>
              <div className="card-body text-center">
                <FontAwesomeIcon icon={item.icon} size="3x" />
                <h5 className="card-title">{item.label}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
      <br />
      <div className="row">
        {menuItems2.map((item, index) => (
          <div key={index} className="col-12 col-md-3">
            <div className="card menu-card" onClick={() => handleClick(item.action)}>
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
};

export default Home;
