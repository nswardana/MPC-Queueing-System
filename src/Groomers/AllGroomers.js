import React, { Component } from 'react';

class AllGroomers extends Component {

  constructor(props){
    super(props);
  }

  render(){
    return(
      <React.Fragment>
      <table className="table table-striped table-hover table-bordered" style={{marginTop:'20px', marginBottom: '20px'}}>
        <thead>
          <tr>
            <th className="text-danger">Name</th>
            <th className="text-danger">On Duty</th>
          </tr>
        </thead>
        <tbody>
          {this.props.groomers.length===0 && <tr><td colSpan="6">No groomers. Add a groomer to start.</td></tr> }
          {this.props.groomers.length>0 && this.props.groomers.map(groomer => (
            <tr key={groomer.groomerId}>
              <td>{groomer.name}</td>
              <td width="100" align="center">
                <input type="checkbox" onChange={() => this.props.toggleDuty(groomer.groomerId)} checked={groomer.onDuty}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </React.Fragment>
    );
  }
}

export default AllGroomers;
