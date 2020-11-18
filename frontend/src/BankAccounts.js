import './BankAccounts.css';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'

class BankAccounts extends Component{
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
    }

    componentDidMount() {
        console.log('props', this.props);
        fetch(`/banks/${this.props.match.params.bankId}/accounts`, {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    const eligibleBankAccounts = body.bankAccounts.filter(
                            bankAccount => {return ['checking', 'credit card'].includes(bankAccount.subtype)}
                        ).map(
                            bankAccount => {return {...bankAccount, isChecked: false}}
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
    }

    handleBankAccountCheckbox = (account_id) => {
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

    handleCheckAllBankAccounts = () => {
        let {eligibleBankAccounts, allBanksChecked} = this.state;
        for(let bankAccount of eligibleBankAccounts) {
                bankAccount.isChecked = !allBanksChecked;
        }
        this.setState({eligibleBankAccounts: eligibleBankAccounts, allBanksChecked: !allBanksChecked});
    }

    handleSaveBankAccounts = () => {
        let {bankItem, eligibleBankAccounts} = this.state;
        const selectedBankAccountIds = [];
        for(const eligibleBankAccount of eligibleBankAccounts) {
            if (eligibleBankAccount.isChecked) {
                console.log(eligibleBankAccount);
                selectedBankAccountIds.push(eligibleBankAccount.account_id);
            }
        }
        console.log(selectedBankAccountIds);


        fetch('link-bank-accounts', {
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
                this.props.history.push('/accounts-summary');
            });
        });
    }

    render() {
        let { isLoading, bankItem, eligibleBankAccounts, bankAccounts, allBanksChecked, hasAuthenticatedUser } = this.state;
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


                    {!isLoading && hasAuthenticatedUser && eligibleBankAccounts != null &&
                        <div>
                            <h2>{bankItem.institutionName} Eligible for Linking/Addition Bank Accounts</h2>
                            <table>
                                <tr>
                                    <th style={{textAlign: 'center'}}>
                                        Check All<br />
                                        <input onChange={this.handleCheckAllBankAccounts} type="checkbox" checked={allBanksChecked} />
                                    </th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Subtype</th>
                                    <th>Available Balance</th>
                                </tr>
                                {eligibleBankAccounts.map((bankAccount) => 
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
                            <Link to="#" onClick={this.handleSaveBankAccounts} className="btn btn-primary">Save Selected Bank Accounts</Link>
                        </div>
                    }

                    {!isLoading && hasAuthenticatedUser && bankAccounts != null &&
                        <div className="pt-5">
                            <h2>All {bankItem.institutionName} Bank Accounts</h2>
                            <table>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Subtype</th>
                                    <th>Available Balance</th>
                                </tr>
                                {bankAccounts.map((bankAccount) => 
                                    <tr>
                                        <td>{bankAccount.name}</td>
                                        <td>{bankAccount.type}</td>
                                        <td>{bankAccount.subtype}</td>
                                        <td style={{textAlign: 'right'}}>{bankAccount.balances.available} {bankAccount.balances.iso_currency_code}</td>
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