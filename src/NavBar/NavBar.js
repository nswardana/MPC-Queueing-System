import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';  // Use useLocation hook to get current location

function NavBar() {
  const location = useLocation(); // Get the current location


  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <h5 className="my-0 mr-md-auto font-weight-normal text-danger">System Antrian Klinik</h5>
      <nav className="my-2 my-md-0 mr-md-3">
      {location.pathname === '/'? null: (
            
        <>
        <NavLink
          exact
          className="p-2 text-dark"
          activeClassName="text-danger"
          to="/">Home</NavLink>

        <NavLink
          className="p-2 text-dark"
          activeClassName="text-danger"
          to="/registration">Pendaftaran</NavLink>

        <NavLink
          className="p-2 text-dark"
          activeClassName="text-danger"
          to="/queue">Antrian</NavLink>

        <NavLink
          className="p-2 text-dark"
          activeClassName="text-danger"
          to="/doctors">Dokter</NavLink>

        <NavLink
          className="p-2 text-dark"
          activeClassName="text-danger"
          to="/groomers">Groomer</NavLink>
          </>
        )}

      </nav>

      <a className="btn btn-outline-danger" href="/login">Login</a>
    </div>
  );
}

export default NavBar;
