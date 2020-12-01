import './Transactions.css';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'
import FileSaver from 'file-saver'

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
        let { isLoading, transactions, transactionsScope, hasAuthenticatedUser } = this.state;
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
                            <h2>{transactionsScope} Debit Transactions</h2>
                            <Link to="#" onClick={this.csvDownload}>Download CSV</Link>
                            <table>
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
                            </table>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Transactions;