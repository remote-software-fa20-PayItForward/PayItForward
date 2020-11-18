import './Transactions.css';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'
import FileSaver from 'file-saver'
=======
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'
>>>>>>> 4a150ab88dce54decaaa554455c2cf9d2da35437

class Transactions extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
<<<<<<< HEAD
            transactions: null,
            transactionsScope: 'Current Month',
            transcationScopeCsvFileName: 'cm-transactins.csv'
=======
            transactions: null
>>>>>>> 4a150ab88dce54decaaa554455c2cf9d2da35437
        }
    }

    componentDidMount() {
        console.log('props', this.props);
<<<<<<< HEAD

        console.log(this.props.match.params.month);

        if(!(['current-month', 'last-month'].includes(this.props.match.params.month))){
            this.props.history.push('/404');
        }



        let transactionsScopeUrl = '/current-month-transactions-and-roundup';
        if (this.props.match.params.month == 'last-month') {
            transactionsScopeUrl = '/last-month-transactions-and-roundup';
            this.setState({transactionsScope: 'Last Month', transcationScopeCsvFileName: 'lm-transactins.csv'});
        }

        

        fetch(transactionsScopeUrl, {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    console.log(body);
                    this.setState({transactions: body , hasAuthenticatedUser: true});
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
=======
        fetch(`/banks/${this.props.match.params.bankId}/accounts/${this.props.match.params.accountId}/transactions`, {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    console.log(body);
                    this.setState({transactions: body.transactions , hasAuthenticatedUser: true});
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
                this.props.history.push('/login');
>>>>>>> 4a150ab88dce54decaaa554455c2cf9d2da35437
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

<<<<<<< HEAD
    csvDownload = () => {
        let csvString = `"Bank Name","Name","Merchant Name","Categories","Type","Amount","Round Up Amount"` + '\n';
        for(let transaction of this.state.transactions.transactions) {
            let categories = transaction.category !== null ? transaction.category.join(',') : '';
            csvString = csvString + `"${transaction.bankName}","${transaction.name}","${transaction.merchant_name}","${categories}","${transaction.transaction_type}","${transaction.amount.toFixed(2)}","${transaction.roundup.toFixed(2)}"` + '\n';
        }
        const csvData = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        FileSaver.saveAs(csvData, this.state.transcationScopeCsvFileName);
    }

    render() {
        let { isLoading, transactions, transactionsScope, hasAuthenticatedUser } = this.state;
=======
    render() {
        let { isLoading, transactions, hasAuthenticatedUser } = this.state;
>>>>>>> 4a150ab88dce54decaaa554455c2cf9d2da35437
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
<<<<<<< HEAD
                            <h2>{transactionsScope} Debit Transactions</h2>
                            <Link to="#" onClick={this.csvDownload}>Download CSV</Link>
                            <table>
                                <tr>
                                    <th>Bank Name</th>
=======
                            <h2>Bank Account Transactions</h2>
                            <table>
                                <tr>
>>>>>>> 4a150ab88dce54decaaa554455c2cf9d2da35437
                                    <th>Name</th>
                                    <th>Merchant Name</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Amount</th>
<<<<<<< HEAD
                                    <th>Round Up Amount</th>
                                </tr>
                                {transactions.transactions.map((transaction) => 
                                    <tr>
                                        <td>{transaction.bankName}</td>
                                        <td>{transaction.name}</td>
                                        <td>{transaction.merchant_name}</td>
                                        <td>{transaction.category !== null ? transaction.category.map((categorystr) => <>{categorystr}&nbsp;</>) : <></>}</td>
                                        <td>{transaction.transaction_type}</td>
                                        <td style={{textAlign: 'right'}}>{transaction.amount.toFixed(2)}&nbsp;{transaction.iso_currency_code}</td>
                                        <td style={{textAlign: 'right'}}>{transaction.roundup.toFixed(2)}&nbsp;{transaction.iso_currency_code}</td>
=======
                                </tr>
                                {transactions.transactions.map((transaction) => 
                                    <tr>
                                        <td>{transaction.name}</td>
                                        <td>{transaction.merchant_name}</td>
                                        <td>{transaction.category.map((categorystr) => <>{categorystr}</>)}</td>
                                        <td>{transaction.transaction_type}</td>
                                        <td style={{textAlign: 'right'}}>{transaction.amount} {transaction.iso_currency_code}</td>
>>>>>>> 4a150ab88dce54decaaa554455c2cf9d2da35437
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