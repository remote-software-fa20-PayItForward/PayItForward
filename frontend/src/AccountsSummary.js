import './AccountsSummary.css';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'

class AccountsSummary extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            bankItems: null,
            bankAccounts: null,
            banks: null,
            lastMonthTransactions: null,
            currentMonthTransactions: null
        }
    }

    componentDidMount() {
        fetch('/linked-bank-accounts', {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    const banks = [];
                    for (const bankAccount of body.bankAccounts) {
                        if (!banks.includes(bankAccount.bankName)) {
                            banks.push(bankAccount.bankName);
                        }
                    }
                    this.setState({bankAccounts: body.bankAccounts, banks: banks, hasAuthenticatedUser: true});
                    if (body.bankAccounts.length > 0) {
                        this.obtainCurrentMonthRoundup();
                        this.obtainLastMonthRoundup();
                    }
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
            }

            this.setState({isLoading: false});
        });
    }

    obtainCurrentMonthRoundup = () => {
        fetch('/current-month-transactions-and-roundup', {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    this.setState({currentMonthTransactions: body});
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
            }

            this.setState({isLoading: false});
        });
    }

    obtainLastMonthRoundup = () => {
        fetch('/last-month-transactions-and-roundup', {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    this.setState({lastMonthTransactions: body});
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
            }

            this.setState({isLoading: false});
        });
    }

    render() {
        let { isLoading, bankAccounts, banks, lastMonthTransactions, currentMonthTransactions, hasAuthenticatedUser } = this.state;
        return(
        
            <div>
            <NavBar />
            <br />
                {isLoading &&
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }

                {!isLoading &&
                <div className="container">
                    <h1>Accounts Summary</h1>

                    {!hasAuthenticatedUser && 
                        <p>Please, <Link to="/login">Log In</Link> to start managing your bank accounts.</p>
                    }

                    {hasAuthenticatedUser && bankAccounts && bankAccounts.length == 0 &&
                        <p>You haven't linked any accounts yet. Please go to <Link to="/manage-banks">Manage Bank Accounts</Link> to start linking banks and bank accounts.</p>
                    }

                    {hasAuthenticatedUser && bankAccounts && bankAccounts.length > 0 &&
                        <>
                        <div className="row">
                            <div>
                                <p>You have connected {bankAccounts.length} bank accounts from {banks.length} banks.</p>
                                <p>You can manage the connected bank accounts at <Link to="/manage-banks">Manage Bank Accounts</Link> page.</p>
                            </div>
                        </div>
                        <div className="row">

                            <div className="card text-center col-6">
                                <div className="card-body">
                                    <h5 className="card-title">Last Month Roundup</h5>
                                    {lastMonthTransactions == null &&
                                    <>
                                    <div className="d-flex justify-content-center pt-3 pb-1">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                    <p className="pb-4">Calculating...</p>
                                    </>
                                    }
                                    {lastMonthTransactions != null &&
                                    <>
                                    <p className="display-3">${lastMonthTransactions.totalRoundup}</p>
                                    <table className="stats">
                                        <tr>
                                            <td style={{textAlign: 'left'}}>Number Of Debit Transactions:</td>
                                            <td style={{textAlign: 'right'}}>{lastMonthTransactions.numberOfTransactions}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'left'}}>Total Amount of Debit Transactions:</td>
                                            <td style={{textAlign: 'right'}}>$ {lastMonthTransactions.transactionsTotalAmount.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'left'}}>Average Debit Transaction:</td>
                                            <td style={{textAlign: 'right'}}>$ {lastMonthTransactions.averageTransaction.toFixed(4)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'left'}}>Average Round Up:</td>
                                            <td style={{textAlign: 'right'}}>$ {lastMonthTransactions.averageRoundUp.toFixed(4)}</td>
                                        </tr>
                                    </table>
                                    </>
                                    }
                                    <Link to="/transactions/last-month" className="btn btn-primary">View Transactions</Link>
                                </div>
                            </div>

                            <div className="card text-center col-6">
                                <div className="card-body">
                                    <h5 className="card-title">Current Month Roundup</h5>
                                    {currentMonthTransactions == null &&
                                    <>
                                    <div className="d-flex justify-content-center pt-3 pb-1">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                    <p className="pb-4">Calculating...</p>
                                    </>
                                    }
                                    {currentMonthTransactions != null &&
                                    <>
                                    <p className="display-3">${currentMonthTransactions.totalRoundup}</p>
                                    <table className="stats">
                                        <tr>
                                            <td style={{textAlign: 'left'}}>Number Of Debit Transactions:</td>
                                            <td style={{textAlign: 'right'}}>{currentMonthTransactions.numberOfTransactions}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'left'}}>Total Amount of Debit Transactions:</td>
                                            <td style={{textAlign: 'right'}}>$ {currentMonthTransactions.transactionsTotalAmount.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'left'}}>Average Debit Transaction:</td>
                                            <td style={{textAlign: 'right'}}>$ {currentMonthTransactions.averageTransaction.toFixed(4)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'left'}}>Average Round Up:</td>
                                            <td style={{textAlign: 'right'}}>$ {currentMonthTransactions.averageRoundUp.toFixed(4)}</td>
                                        </tr>
                                    </table>
                                    </>
                                    }
                                    <Link to="/transactions/current-month" className="btn btn-primary">View Transactions</Link>
                                </div>
                            </div>

                            
                        </div>
                        </>
                    }
                </div>
                }
            </div>
        );
    }
}

export default AccountsSummary;