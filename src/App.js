import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import Registration from './Registration/Registration';
import RegistrationWrapper from './Registration/RegistrationWrapper';  // Import the wrapper component
import Layanan from './Registration/Layanan';
import PrintAntrian from './Registration/PrintAntrian';
import Doctors from './Doctors/Doctors';
import Groomers from './Groomers/Groomers';
import Queue from './Queues/Queue';
import Inactiveickets from './Report/InactiveTickets';
import ModalExample from './Home/ModalExample';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        {/* Define the Routes using the new 'element' prop */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<RegistrationWrapper />} />
          <Route path="/registration/layanan" element={<Layanan />} />
          <Route path="/registration/print" element={<PrintAntrian />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/groomers" element={<Groomers />} />
          <Route path="/report" element={<Inactiveickets />} />
          <Route path="/test" element={<ModalExample />} />
        </Routes>
      </div>
    );
  }
}

export default App;
