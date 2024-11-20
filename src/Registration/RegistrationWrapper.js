import React from 'react';
import { useNavigate } from 'react-router-dom';
import Registration from './Registration'; // Import your class component

const RegistrationWrapper = () => {
  const navigate = useNavigate();  // Using the useNavigate hook

  return <Registration navigate={navigate} />;  // Passing navigate as a prop
};

export default RegistrationWrapper;
