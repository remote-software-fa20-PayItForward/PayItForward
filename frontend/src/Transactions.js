import './Transactions.css';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'
import FileSaver from 'file-saver'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

class Transactions extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            transactions: null,
            transactionsScope: 'Current Month',
            transcationScopeCsvFileName: 'cm-transactins.csv'
        }
    }

    componentDidMount() {
        console.log('props', this.props);

        console.log(this.props.match.params.month);

        fetch('/transactions/all-transactions', {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    console.log(body);
                    this.setState({transactions: body , hasAuthenticatedUser: true});
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
            }

            if (!response.ok && response.status == 409) {
                response.json().then(body => {
                    if (body.error != null) {
                        alert(body.error);
                    }
                });
                return;
            }

            if (!response.ok && response.status == 500) {
                response.json().then(body => {
                    if (body.error != null) {
                        alert(body.error);
                    }
                });
                return;
            }

            this.setState({isLoading: false});
        });
    }

    csvDownload = () => {
        let csvString = `"Bank Name","Name","Merchant Name","Categories","Type","Marked For Deletion","Amount","Round Up Amount"` + '\n';
        for(let transaction of this.state.transactions.transactions) {
            let categories = transaction.categories !== null ? transaction.categories.join(',') : '';
            csvString = csvString + `"${transaction.bankName}","${transaction.name}","${transaction.merchant_name}","${categories}","${transaction.transaction_type}","${transaction.isMarkedForDeletion ? 'YES' : 'NO'}","${transaction.amount}","${transaction.roundup}"` + '\n';
        }
        const csvData = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        FileSaver.saveAs(csvData, this.state.transcationScopeCsvFileName);
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
        dataField: 'bankName',
        text: 'Bank Name',
        sort: true
      }, {
        dataField: 'name',
        text: 'Transaction Name',
        sort: true
      }, {
        dataField: 'merchant_name',
        text: 'Merchant Name',
        sort: true
      },  {
        dataField: 'isMarkedForDeletion',
        text: 'Active',
        sort: true,
        formatter: (value, row) => (
          <span>{value ? <span>YES</span> : <span>NO</span>}</span>
        )
      },  {
        dataField: 'amount',
        text: 'Amount',
        sort: true
      },  {
        dataField: 'roundup',
        text: 'Round Up',
        sort: true
      }];

        let { isLoading, transactions, transactionsScope, hasAuthenticatedUser } = this.state;
        console.log('hello: ', transactions);
        return(

            <div>

                <NavBar />

                <br />

                <div className="">
                    {isLoading &&
                        <p>Loading...</p>
                    }




                    {!isLoading && !hasAuthenticatedUser &&
                        <p>Please, <Link to="/login">Log In</Link> to start managing your bank accounts.</p>
                    }


                    {!isLoading && hasAuthenticatedUser && transactions != null &&
                        <div>

                          <Row className="justify-content-center mt-3 mb-5">

                            <div className="row py-5">
                              <div className="col-lg-10 mx-auto">
                                <div className="card rounded shadow border-0">
                                  <div className="card-body p-5 bg-white rounded">

                                    <h1 className="purple-text text-center font-weight-bold mb-3">{transactionsScope} Debit Transactions</h1>

                                    <Row className="justify-content-center mb-3">
                                      <Button className="text-center" onClick={this.csvDownload}>Download CSV</Button>
                                    </Row>

                                    <BootstrapTable bootstrap4 keyField='id' data={ transactions.transactions } columns={ columns } pagination={ pagination } />

                                  </div>
                                </div>
                              </div>
                            </div>

                            </Row>

                            {/*}<table>
                                <tr>
                                    <th>Bank Name</th>
                                    <th>Name</th>
                                    <th>Merchant Name</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Marked For Deletion</th>
                                    <th>Amount</th>
                                    <th>Round Up Amount</th>
                                </tr>
                                {transactions.transactions.map((transaction) =>
                                    <tr>
                                        <td>{transaction.bankName}</td>
                                        <td>{transaction.name}</td>
                                        <td>{transaction.merchant_name}</td>
                                        <td>{transaction.categories !== null ? <>{transaction.categories.join(',')}&nbsp;</> : <></>}</td>
                                        <td>{transaction.transaction_type}</td>
                                        <td>{transaction.isMarkedForDeletion ? 'YES' : 'NO'}</td>
                                        <td style={{textAlign: 'right'}}>{transaction.amount}&nbsp;{transaction.iso_currency_code}</td>
                                        <td style={{textAlign: 'right'}}>{transaction.roundup}&nbsp;{transaction.iso_currency_code}</td>
                                    </tr>)}
                            </table>*/}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Transactions;
