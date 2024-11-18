import React, { Component } from 'react';
import ReactLoading from 'react-loading'; // Import ReactLoading component

class AllDoctors extends Component {

  render() {
    const { doctors, toggleDuty, deleteDoctor, loading } = this.props;

    return (
      <React.Fragment>
        {/* Show loading spinner while data is being fetched */}
        {loading && (
          <div className="text-center">
            <ReactLoading type="spin" color="#0000ff" height={50} width={50} />
            <p>Loading doctors...</p>
          </div>
        )}

        {/* Table displaying doctors' info */}
        {!loading && (
          <table className="table table-striped table-hover table-bordered" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th className="text-danger">Name</th>
                <th className="text-danger">On Duty</th>
                <th className="text-danger">Actions</th> {/* Added actions column for delete button */}
              </tr>
            </thead>
            <tbody>
              {/* Handle case when no doctors are present */}
              {doctors.length === 0 && (
                <tr>
                  <td colSpan="3">No doctors available. Add a doctor to start.</td>
                </tr>
              )}

              {/* Map through doctors and display each row */}
              {doctors.length > 0 && doctors.map(doctor => (
                <tr key={doctor.doctorId}>
                  <td>{doctor.name}</td>
                  <td width="100" align="center">
                    <input
                      type="checkbox"
                      onChange={() => toggleDuty(doctor.doctorId)}
                      checked={doctor.onDuty}
                    />
                  </td>
                  <td width="100" align="center">
                    {/* Delete button */}
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteDoctor(doctor.doctorId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </React.Fragment>
    );
  }
}

export default AllDoctors;
