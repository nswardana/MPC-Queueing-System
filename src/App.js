import React, { Component } from 'react';
import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import Registration from './Registration/Registration';
import Layanan from './Registration/Layanan';
import PrintAntrian from './Registration/PrintAntrian';
import Doctors from './Doctors/Doctors';
import Groomers from './Groomers/Groomers';
import Queue from './Queues/Queue';
import ModalExample from './Home/ModalExample';
import {Route} from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path="/" component={Home} />
        <Route exact path="/registration" component={Registration} />
        <Route path="/registration/layanan" component={Layanan} />
        <Route path="/registration/print" component={PrintAntrian}/>
        <Route exact path="/queue" component={Queue} />
        <Route exact path="/doctors" component={Doctors} />
        <Route exact path="/groomers" component={Groomers} />
        <Route exact path="/test" component={ModalExample} />
      </div>
    );
  }
}

export default App;
