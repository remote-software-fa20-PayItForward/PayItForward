import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CardColumns from 'react-bootstrap/CardColumns';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import NavBar from './Navbar';
import React, { Component } from "react";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';

class DonationHistory extends Component{

  constructor(props) {
      super(props);
      this.state = {
        sprouts: {}
      }
  }

  componentDidMount() {
    let sprouts = [];
    fetch('/user').then((response) => {
      if (response.ok) {
        response.json().then(body => {
            if (!body.username) {
              this.props.history.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
            } else {
              this.setState({
                _id: body._id
              })
              //get all sprouts donor has/is contributing to
              fetch(`/donation-record/${this.state._id}`).then((response) => {
                response.json().then(body => {
                    sprouts = body;
                    //get all donation request
                    fetch('/donation-request/all').then((response) => {
                      response.json().then(body => {
                        for (let i = 0; i < sprouts.length; i++) {
                          let index = (body.findIndex(p => p._id == sprouts[i].donationRequest));
                          sprouts[i].name = body[index].name;
                          sprouts[i].status = body[index].status;
                        }
                        this.setState({
                          sprouts: sprouts
                        })
                      })
                    })
                });
              });
            }

        })
      }
    })
  }

  render() {
    const pagination = paginationFactory({
      page: 1,
      alwaysShowAllBtns: true,
      showTotal: true,
      withFirstAndLast: false,
      sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
        <div className="dataTables_length" id="datatable-basic_length" style={{width: '50%'}}>

              <select
                name="datatable-basic_length"
                aria-controls="datatable-basic"
                className="form-control form-control-sm"
                onChange={e => onSizePerPageChange(e.target.value)}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>

        </div>
      )
    });

    const columns = [{
      dataField: 'date',
      text: 'Date',
      sort: true
    }, {
      dataField: 'name',
      text: 'Sprout Name',
      sort: true
    }, {
      dataField: 'donatedAmount',
      text: 'Donated Amount',
      sort: true,
      formatter: (value, row) => (
        <span>${value.toFixed(2)}</span>
      )
    },  {
      dataField: 'status',
      text: 'Status',
      sort: true
    }];

    return (

      <div>
        <NavBar />

        <Row className="justify-content-center m-5">

        <div className="row py-5">
          <div className="col-lg-10 mx-auto">
            <div className="card rounded shadow border-0">
              <div className="card-body p-5 bg-white rounded">

                <h1 className="purple-text text-center font-weight-bold mb-3">My Donation History </h1>
                <BootstrapTable bootstrap4 keyField='id' data={ this.state.sprouts } columns={ columns } pagination={ pagination } />

              </div>
            </div>
          </div>
        </div>

        </Row>

      </div>
    )
  }

}

export default DonationHistory;
