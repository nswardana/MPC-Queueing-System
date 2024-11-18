import React, { Component } from 'react';
import ReactLoading from 'react-loading';

class AllGroomers extends Component {
  render() {
    const { groomers, toggleDuty, deleteGroomer, loading } = this.props;

    return (
      <React.Fragment>

        {!loading && (
          <table className="table table-striped table-hover table-bordered" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th className="text-danger">Name</th>
                <th className="text-danger">On Duty</th>
                <th className="text-danger">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groomers.length === 0 && (
                <tr>
                  <td colSpan="3">No groomers available. Add a groomer to start.</td>
                </tr>
              )}

              {groomers.length > 0 && groomers.map(groomer => (
                <tr key={groomer.groomerId}>
                  <td>{groomer.name}</td>
                  <td width="100" align="center">
                    <input
                      type="checkbox"
                      onChange={() => toggleDuty(groomer.groomerId)}
                      checked={groomer.onDuty}
                    />
                  </td>
                  <td width="100" align="center">
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteGroomer(groomer.groomerId)} // Ensure this is called correctly
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

export default AllGroomers;
