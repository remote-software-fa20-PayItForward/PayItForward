import './HomePage.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51HlnHWIfMQHs5Z9IuL8N16OlzlwZMD425Ev9UrplmvI35xjlzNfBmMkhRIrdWNwMUtTz6xCSl0kzs1bAVRfNUoDi00qJFHqKAO');


class HomePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            bankItems: null,
            errorMsg: ""
        }
        this.triggerPlaidLinkOpen = this.triggerPlaidLinkOpen.bind(this);
    }

    triggerPlaidLinkOpen() {
        this.setState({isLoading: true}, () => {
            fetch('/obtain-plaid-link-token', {credentials: 'include'}).then((response) => {
                if (!response.ok && response.status == 401) {
                    this.setState({hasAuthenticatedUser: false});
                    return;
                }

                response.json().then(body => {
                    console.log(body);
                });
                this.setState({isLoading: false});
            });
        });
    }

    componentDidMount() {
        fetch('/linked-banks', {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    this.setState({bankItems: body.bankItems, hasAuthenticatedUser: true});
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
            }
            this.setState({isLoading: false});
        });
    }
/*
    async submit(e){
        const stripe = await stripePromise;
        const response = await fetch('/create-checkout-session', { method: 'POST' });
        const session = await response.json();
        const result = await stripe.redirectToCheckout({
        sessionId: session.id,
        });
        if (result.error) {
            <h1>{result.error.message}</h1>
            }
        };*/


    render() {
        let { isLoading, bankItems, hasAuthenticatedUser } = this.state;
        return(
        
            <div>
                {/*
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Pay it Forward</Navbar.Brand>
                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item" id="logout">
                        <a className="nav-link" href="#">Log Out</a>
                    </li>
                </ul>
            </div>
            
        </Navbar>
                */}
            <NavBar />
            <br />
                <div className="container">
                    <h1>Welcome</h1>
                    {isLoading &&
                        <p>Loading...</p>
                    }
                    
                    {!isLoading && !hasAuthenticatedUser && 
                        <p>Please <Link to="/login">log in</Link> to start managing your bank accounts.</p>
                    }
                    {!isLoading && hasAuthenticatedUser &&
                        <div>
                            <h2>Connected Banks</h2>
                            <ul>
                            {bankItems.map((bankItem) => <li>{bankItem.bankName} <Link to={`/banks/${bankItem.bankId}/accounts`}>View Accounts</Link></li>)}
                            </ul>
                            <Link to="/link-bank-account" onClick={this.triggerPlaidLinkOpen}>Link New Bank</Link>
                            <br></br>
                        {/* <form className="register-form" onSubmit={(e) => { this.submit(); e.preventDefault(); }}>
                            <div className="error">{this.state.errorMsg}</div>
                            <input type="number" name="donationAmount" placeholder="amount" required/>
                            <button type="submit">Donate</button>
                            </form> */}
                            <button role="link" onClick={async (event) => {
                                const stripe = await stripePromise;
                                const response = await fetch('/create-checkout-session', { method: 'POST' });
                                const session = await response.json();
                                const result = await stripe.redirectToCheckout({
                                sessionId: session.id,
                                });
                                if (result.error) {
                                    <h1>{result.error.message}</h1>
                                }
                            }}>
                            Donate
                        </button>  
                        {/* if no bank account connected create new button */}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default HomePage;
