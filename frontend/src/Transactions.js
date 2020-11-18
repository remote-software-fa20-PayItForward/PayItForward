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
                                    <th>Amount</th>
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