import './ManageBanks.css'
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { PlaidLink } from 'react-plaid-link';
import NavBar from './Navbar'

class ManageBanks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            link_token: null,
            public_link_token: null,
            bankItems: null,
            bankAccounts: null
        }
        this.handlePlaidHandoff = this.handlePlaidHandoff.bind(this);
        this.obtainPlaidLinkToken = this.obtainPlaidLinkToken.bind(this);
        this.obtainBankList = this.obtainBankList.bind(this);
        this.obtainBankAccounts = this.obtainBankAccounts(this);
    }

    componentDidMount() {
        this.obtainPlaidLinkToken();
        this.obtainBankList();
    }

    obtainPlaidLinkToken = () => {
        fetch('/obtain-plaid-link-token', {credentials: 'include'}).then((response) => {
            if (!response.ok && response.status == 401) {
                this.setState({isLoading: false, hasAuthenticatedUser: false});
                return;
            }

            response.json().then(body => {
                console.log(body);
                this.setState({hasAuthenticatedUser: true, link_token: body});
            });
            this.setState({isLoading: false});
        });
    }

    obtainBankList = () => {
        fetch('/linked-banks', {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    this.setState({bankItems: body.bankItems, hasAuthenticatedUser: true});
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
            }
        });
    }

    obtainBankAccounts = () => {
        fetch('/linked-bank-accounts', {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    this.setState({bankAccounts: body.bankAccounts, hasAuthenticatedUser: true});
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
            }

            this.setState({isLoading: false});
        });
    }

    handlePlaidHandoff(event) {
        if (event == 'HANDOFF' && this.state.public_link_token != null) {
            // the Plaid Link (bank account login) modal dialog has just closed after sucessfull linkage
            // pass public_link_token to the backend and obtain access_token and Plaid Item for it
            // (the backeng is going to register the newly linked bank account unless it is already stored to the user's bank account DB)
            this.setState({isLoading: true}, () => {
                fetch('link-bank', {
                    credentials: 'include',
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({public_link_token: this.state.public_link_token})
                }).then((response) => {
                    this.setState({isLoading: false});
                    
                    if (!response.ok && response.status == 401) {
                        this.setState({hasAuthenticatedUser: false});
                        return;
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
        
                    response.json().then(body => {
                        this.obtainBankList();
                    });
                });
            });
          
        }
    }

    
    render() {
        let { isLoading, hasAuthenticatedUser, link_token, bankItems, bankAccounts } = this.state;
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
                    {!hasAuthenticatedUser && 
                        <p>You are not authenticated. Please <Link to="/login">Log In</Link> to allow linking your bank account.</p>
                    }

                    {hasAuthenticatedUser && link_token != null &&
                        //<PlaidLink token={link_token} onSuccess={(e) => {console.log(e);}}>//
                        <>
                        <div className="row">
                            <div className="col-3">
                                <h2>Linked Banks</h2>
                            </div>
                            <div className="col-3">
                                <PlaidLink
                                    className="btn btn-primary"
                                    style={{ padding: '', border: '', background: '' }}
                                    product={['auth', 'transactions']}
                                    token={link_token.link_token}
                                    onExit={(e) => {console.log('Plaid Link EXIT:', e)}}
                                    onSuccess={(public_token) => {this.setState({public_link_token: public_token})}}
                                    onEvent={this.handlePlaidHandoff}
                                >
                                    Connect New Bank
                                </PlaidLink>
                            </div>
                        </div>
                        <hr />
                        {bankItems !== null && bankItems.length > 0 &&
                        <div className="row">
                            {bankItems.map(bankItem => {
                                return (
                                <div className="col-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">{bankItem.bankName}</h5>
                                            <Link to={`/banks/${bankItem.bankId}/accounts`} className="btn btn-primary">Manage Selected Accounts</Link>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                        }
                        </>
                    }


                    {hasAuthenticatedUser &&
                        //<PlaidLink token={link_token} onSuccess={(e) => {console.log(e);}}>//
                        <>
                        <div className="row pt-5">
                            <div className="col-12">
                                <h2>Linked Bank Accounts</h2>
                            </div>
                        </div>
                        <hr />
                        {bankAccounts !== null && bankAccounts.length == 0 &&
                            <p>You haven't linked any bank accounts yet. Please, first link a bank and then manage bank account selection from there.</p>
                        }
                        {bankAccounts !== null && bankAccounts.length > 0 &&
                        <div className="row">
                            <table>
                                <tr>
                                    <th>Bank Name</th>
                                    <th>Name</th>
                                    <th>Officaial Name</th>
                                    <th>Type</th>
                                    <th>Subtype</th>
                                </tr>
                                {bankAccounts.map(bankAccount => {
                                        return (
                                        <tr>
                                            <td>{bankAccount.bankName}</td>
                                            <td>{bankAccount.name}</td>
                                            <td>{bankAccount.official_name}</td>
                                            <td>{bankAccount.type}</td>
                                            <td>{bankAccount.subtype}</td>
                                        </tr>
                                        );
                                    }
                                )}
                            </table>
                        </div>
                        }
                        </>
                    }
                </div>
                }
            </div>
        );
    }
}

export default ManageBanks;