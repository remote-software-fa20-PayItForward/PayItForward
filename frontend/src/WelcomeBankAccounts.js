import React, { Component } from "react";
import NavBar from './Navbar'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Welcome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            bankItem: null,
            bankAccounts: null,
            eligibleBankAccounts: null,
            allBanksChecked: false
        }
        this.handleCheckAllBankAccounts = this.handleCheckAllBankAccounts.bind(this);
        this.handleBankAccountCheckbox = this.handleBankAccountCheckbox.bind(this);
        this.handleSaveBankAccounts = this.handleSaveBankAccounts.bind(this);
    }

    componentDidMount() {
        fetch('/banks/', {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    let bankItem = body.bankItems[0].bankId;
                    fetch(`/banks/${bankItem}/accounts`, {credentials: 'include'}).then((response) => {
                        if (response.ok) {
                            response.json().then(body => {
                                const eligibleBankAccounts = body.bankAccounts.filter(
                                        bankAccount => {return ['checking', 'credit card'].includes(bankAccount.subtype)}
                                    );

                                this.setState({bankItem: body.bankItem, bankAccounts: body.bankAccounts, eligibleBankAccounts: eligibleBankAccounts, hasAuthenticatedUser: true});
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
                });
            } else if (response.status == 401) {
                this.props.history.push('/register');
            }
        });
    }

    obtainBankList() {
        fetch('/banks/', {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    return body.bankItems;
                });
            } else if (response.status == 401) {
                this.props.history.push('/register');
            }
        });
    }

    handleBankAccountCheckbox(account_id) {
        let eligibleBankAccounts = this.state.eligibleBankAccounts;
        //console.log(bankAccounts);
        for(let bankAccount of eligibleBankAccounts) {
            if (bankAccount.account_id === account_id) {
                bankAccount.isChecked = !bankAccount.isChecked;
                break;
            }
        }
        this.setState({eligibleBankAccounts: eligibleBankAccounts});
    }

    handleCheckAllBankAccounts() {
        let {eligibleBankAccounts, allBanksChecked} = this.state;
        for(let bankAccount of eligibleBankAccounts) {
                bankAccount.isChecked = !allBanksChecked;
        }
        this.setState({eligibleBankAccounts: eligibleBankAccounts, allBanksChecked: !allBanksChecked});
    }

    handleSaveBankAccounts() {
        let {bankItem, eligibleBankAccounts} = this.state;
        const selectedBankAccountIds = [];
        for(const eligibleBankAccount of eligibleBankAccounts) {
            if (eligibleBankAccount.isChecked) {
                console.log(eligibleBankAccount);
                selectedBankAccountIds.push(eligibleBankAccount.account_id);
            }
        }
        console.log(selectedBankAccountIds);


        fetch(`/banks/${bankItem._id}/link-bank-accounts`, {
            credentials: 'include',
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({selectedBankAccountIds: selectedBankAccountIds})
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
                this.props.history.push('/welcome/card');
            });
        });
    }

    render() {
        return(
            <div>
                <NavBar />
                <Row className="justify-content-center mt-5">
                  <Col md={8}>
                  	<CardGroup className="pl-3 pb-3 text-center">
                  		<Card className="mr-3 text-dark rounded text-left shadow p-3">
                  			<Card.Body>
                        <h1 className="purple-text">Authorized Banks</h1>
                        <hr />
                        <p className="lead">Select the banks you want to use for round-ups</p>
                        <br />
                        <div className="container">
                            {this.state.isLoading &&
                                <p>Loading...</p>
                            }

                            {!this.state.isLoading && this.state.hasAuthenticatedUser && this.state.eligibleBankAccounts != null &&
                                <div>
                                    <h2>{this.state.bankItem.institutionName} Eligible Bank Accounts</h2>
                                    <table>
                                        <tr>
                                            <th style={{textAlign: 'center'}}>
                                                Check All<br />
                                                <input onChange={this.handleCheckAllBankAccounts} type="checkbox" checked={this.state.allBanksChecked} />
                                            </th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Subtype</th>
                                            <th>Available Balance</th>
                                        </tr>
                                        {this.state.eligibleBankAccounts.map((bankAccount) =>
                                            <tr>
                                                <td style={{textAlign: 'center'}}>
                                                    <input key={bankAccount.account_id} onChange={() => this.handleBankAccountCheckbox(bankAccount.account_id) } type="checkbox" checked={bankAccount.isChecked} value={bankAccount.account_id} />
                                                </td>
                                                <td>{bankAccount.name}</td>
                                                <td>{bankAccount.type}</td>
                                                <td>{bankAccount.subtype}</td>
                                                <td style={{textAlign: 'right'}}>{bankAccount.balances.available} {bankAccount.balances.iso_currency_code}</td>
                                            </tr>)}
                                    </table>
                                    <br />
                                    <Link to="#" onClick={this.handleSaveBankAccounts} className="btn btn-primary">Save Selected Bank Accounts</Link><Link to="/home"><Button variant="link">Skip</Button></Link>
                                </div>
                            }
                        </div>
                      </Card.Body>
                    </Card>
                  </CardGroup>
                </Col>
              </Row>
            </div>
        )
    }
}

export default Welcome;
