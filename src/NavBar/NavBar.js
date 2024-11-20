import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Use useLocation hook to get current location

function NavBar() {
  const location = useLocation(); // Get the current location
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // Check authentication status

  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <h5 className="my-0 mr-md-auto font-weight-normal text-danger">Sistem Antrian Klinik</h5>
      <nav className="my-2 my-md-0 mr-md-3">
        {location.pathname !== '/' && location.pathname !== '/login' && (
          <>
            <NavLink
              className={({ isActive }) => `p-2 text-dark ${isActive ? 'text-danger' : ''}`}
              end
              to="/"
            >
              Home
            </NavLink>

            <NavLink
              className={({ isActive }) => `p-2 text-dark ${isActive ? 'text-danger' : ''}`}
              to="/registration"
            >
              Pendaftaran
            </NavLink>

            <NavLink
              className={({ isActive }) => `p-2 text-dark ${isActive ? 'text-danger' : ''}`}
              to="/queue"
            >
              Antrian
            </NavLink>

            <NavLink
              className={({ isActive }) => `p-2 text-dark ${isActive ? 'text-danger' : ''}`}
              to="/doctors"
            >
              Dokter
            </NavLink>

            <NavLink
              className={({ isActive }) => `p-2 text-dark ${isActive ? 'text-danger' : ''}`}
              to="/groomers"
            >
              Groomer
            </NavLink>

            <NavLink
              className={({ isActive }) => `p-2 text-dark ${isActive ? 'text-danger' : ''}`}
              to="/report"
            >
              Report
            </NavLink>

            {!isAuthenticated ? (
              <a className="btn btn-outline-danger" href="/login">
                Login
              </a>
            ) : (
              <button className="btn btn-outline-danger" onClick={() => {
                localStorage.removeItem('isAuthenticated');
                window.location.href = '/login'; // Redirect to login after logout
              }}>
                Logout
              </button>
            )}
          </>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
