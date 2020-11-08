import './Accounts.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'

class BankAccounts extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            bankAccounts: null
        }
    }

    componentDidMount() {
        console.log('props', this.props);
        fetch(`/banks/${this.props.match.params.bankId}/accounts`, {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    this.setState({bankAccounts: body.bankAccounts, hasAuthenticatedUser: true});
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

    render() {
        let { isLoading, bankAccounts, hasAuthenticatedUser } = this.state;
        return(
        
            <div>
                
                <NavBar />

                <br />

                <div className="container">
                    {isLoading &&
                        <p>Loading...</p>
                    }

                    
                    
                    
                    {!isLoading && !hasAuthenticatedUser && 
                        <p>Please, <Link to="/login">Log In</Link> to start managing your bank accounts.</p>
                    }


                    {!isLoading && hasAuthenticatedUser && bankAccounts != null &&
                        <div>
                            <h2>Bank Accounts</h2>
                            <table>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Subtype</th>
                                    <th>Available Balance</th>
                                    <th>Actions</th>
                                </tr>
                                {bankAccounts.accounts.map((bankAccount) => 
                                    <tr>
                                        <td>{bankAccount.name}</td>
                                        <td>{bankAccount.type}</td>
                                        <td>{bankAccount.subtype}</td>
                                        <td style={{textAlign: 'right'}}>{bankAccount.balances.available} {bankAccount.balances.iso_currency_code}</td>
                                        <td><Link to={`/banks/${this.props.match.params.bankId}/accounts/${bankAccount.account_id}/transactions`}>View Last Month Transactions</Link></td>
                                    </tr>)}
                            </table>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default BankAccounts;