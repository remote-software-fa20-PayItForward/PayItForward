import './Transactions.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'

class Transactions extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            transactions: null
        }
    }

    componentDidMount() {
        console.log('props', this.props);
        fetch(`/banks/${this.props.match.params.bankId}/accounts/${this.props.match.params.accountId}/transactions`, {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    console.log(body);
                    this.setState({transactions: body.transactions , hasAuthenticatedUser: true});
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
        let { isLoading, transactions, hasAuthenticatedUser } = this.state;
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


                    {!isLoading && hasAuthenticatedUser && transactions != null &&
                        <div>
                            <h2>Bank Account Transactions</h2>
                            <table>
                                <tr>
                                    <th>Name</th>
                                    <th>Merchant Name</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                </tr>
                                {transactions.transactions.map((transaction) => 
                                    <tr>
                                        <td>{transaction.name}</td>
                                        <td>{transaction.merchant_name}</td>
                                        <td>{transaction.category.map((categorystr) => <>{categorystr}</>)}</td>
                                        <td>{transaction.transaction_type}</td>
                                        <td style={{textAlign: 'right'}}>{transaction.amount} {transaction.iso_currency_code}</td>
                                    </tr>)}
                            </table>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Transactions;