import './AccountsSummary.css';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

class AccountsSummary extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            bankItems: null,
            bankAccounts: null,
            banks: null,
            currentMonthTransactions: null
        }
    }

    componentDidMount() {
        fetch('/banks/accounts', {credentials: 'include'}).then((response) => {
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
                    }
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
            }

            this.setState({isLoading: false});
        });
    }

    obtainCurrentMonthRoundup = () => {
        fetch('/transactions/all-transactions', {credentials: 'include'}).then((response) => {
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

    render() {
        let { isLoading, bankAccounts, banks, lastMonthTransactions, currentMonthTransactions, hasAuthenticatedUser } = this.state;
        return(

            <div>
                {isLoading &&
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }

                {!isLoading &&
                <div>

                    {!hasAuthenticatedUser &&
                        <p>Please, <Link to="/login">Log In</Link> to start managing your bank accounts.</p>
                    }

                    {hasAuthenticatedUser && bankAccounts && bankAccounts.length == 0 &&
                        <p>You haven't linked any accounts yet. Please go to <Link to="/manage-banks">Manage Bank Accounts</Link> to start linking banks and bank accounts.</p>
                    }

                    {hasAuthenticatedUser && bankAccounts && bankAccounts.length > 0 &&
                        <>


                                    {currentMonthTransactions == null &&
                                    <>
                                    <div className="d-flex justify-content-center pt-3 pb-1">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                    Calculating...
                                    </>
                                    }
                                    {currentMonthTransactions != null &&
                                    <>

                                    <Col md={12} className="mt-4 border rounded purple-bg">

                                                <h2 className="my-3 text-center">My Account Stats</h2>

                                                <CardGroup className="pl-3 pb-3 text-center">
                                                    <Card className="mr-3 text-dark rounded">
                                                        <Card.Body>
                                                            <h1 className="font-weight-bold purple-text">${parseFloat(currentMonthTransactions.totalRoundup).toFixed(2)} </h1>
                                                            <h4 className="font-weight-bold"> current month round up </h4>
                                                        </Card.Body>
                                                    </Card>
                                                    <Card className="mr-3 text-dark rounded">
                                                        <Card.Body>
                                                            <h1 className="font-weight-bold purple-text"> {currentMonthTransactions.numberOfTransactions} </h1>
                                                            <h4 className="font-weight-bold"> debit transactions </h4>
                                                        </Card.Body>
                                                    </Card>
                                                    <Card className="mr-3 text-dark rounded">
                                                        <Card.Body>
                                                            <h1 className="font-weight-bold purple-text"> ${parseFloat(currentMonthTransactions.averageRoundUp).toFixed(2)} </h1>
                                                            <h4 className="font-weight-bold"> average round up </h4>
                                                        </Card.Body>
                                                    </Card>
                                                </CardGroup>

                                                <div className="text-center pb-3">
                                                    <Link to="/transactions/current-month" className="btn btn-primary">View Transactions</Link>
                                                    <br />
                                                </div>

                                            </Col>
                                    </>
                                    }



                        </>
                    }
                </div>
                }
            </div>
        );
    }
}

export default AccountsSummary;
