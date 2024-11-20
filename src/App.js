// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import RegistrationWrapper from './Registration/RegistrationWrapper';
import Layanan from './Registration/Layanan';
import PrintAntrian from './Registration/PrintAntrian';
import Doctors from './Doctors/Doctors';
import Groomers from './Groomers/Groomers';
import Queue from './Queues/Queue';
import Inactiveickets from './Report/InactiveTickets';
import ModalExample from './Home/ModalExample';
import Login from './Login/Login';  // Import the Login component
import ProtectedRoute from './ProtectedRoute';  // Import the ProtectedRoute

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<RegistrationWrapper />} />
        <Route path="/registration/layanan" element={<Layanan />} />
        <Route path="/registration/print" element={<PrintAntrian />} />
        
        {/* Protected Routes */}
        <Route 
          path="/queue" 
          element={
            <ProtectedRoute>
              <Queue />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/doctors" 
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route path="/groomers"  element={
            <ProtectedRoute>
              <Groomers />
            </ProtectedRoute>
          }/>
          <Route path="/report"  element={
            <ProtectedRoute>
              <Inactiveickets />
            </ProtectedRoute>
          }/>   
        {/* Non-protected Routes */}
          <Route path="/test" element={<ModalExample />} />
      </Routes>
    </div>
  );
};

export default App;
