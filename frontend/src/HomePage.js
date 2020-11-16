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
            firstname: "",
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
                    this.setState({bankItems: body.bankItems, hasAuthenticatedUser: true, firstname: body.firstname});
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
        
            <div className="bg-light" >
                <NavBar />
                
                    <div className="container">
                        
                        {isLoading &&
                            <p>Loading...</p>
                        }
                        
                        {!isLoading && !hasAuthenticatedUser && 
                            <p>Please <Link to="/login">log in</Link> to start managing your bank accounts.</p>
                        }
                        {!isLoading && hasAuthenticatedUser &&
                            <div>
                            
                                <div class="container mt-5">
                                  <div class="row mt-5 border">
                                    <div class="col-4 pt-3 text-center bg-white">
                                        <h3 className="font-weight-bold">You've helped grow <br /> [total #] of Sprouts.</h3>
                                        <img src="/sprout.png" style={{width: "50%"}}/>
                                    </div>
                                    <div class="col-8 purple-bg p-5">
                                      <h2 className="font-weight-bold">
                                            Hi {this.state.firstname}, 
                                            <br />
                                            your next sprout donation of [$amount] will happen on [date].
                                        </h2>
                                        <br />
                                        <a href="#" className="font-weight-bold purple-bg"><h5>Update my sprouting preferences →</h5></a>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="card-deck mt-5">
                                    <div className="card p-5">
                                        <h3 className="font-weight-bold">Request a Sprout </h3>
                                        <p className="lead mt-3">Select from our donation categories and plant your very own sprout!</p>
                                        <div class="card-footer bg-white p-0" style={{border: "none"}}>
                                            <Link to="#"><Button className="purple-btn font-weight-bold">Let's plant!</Button></Link>
                                            <img src="/plant.png" style={{width: "30%"}} className="float-right"/>
                                        </div>
                                    </div>
                                    
                                    <div className="card p-5">
                                        <h3 className="font-weight-bold">Send a Sprout</h3>
                                        <p className="lead mt-3">Feeling generous? Choose to donate your change and help grow a fellow sprout!</p>
                                        <div class="card-footer bg-white p-0" style={{border: "none"}}>
                                            <Button className="purple-btn font-weight-bold" onClick={async (event) => {
                                              const stripe = await stripePromise;
                                              const response = await fetch('/create-checkout-session', { method: 'POST' });
                                              const session = await response.json();
                                              const result = await stripe.redirectToCheckout({
                                                sessionId: session.id,
                                              });
                                              if (result.error) {
                                               <h1>{result.error.message}</h1>
                                              }
                                            }}>Let's grow!</Button>
                                            <img src="/grow.png" style={{width: "30%"}} className="float-right"/>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="card-deck mt-5">
                                    <div className="card p-5 position-relative text-center purple-bg">
                                        <h3 className="font-weight-bold mb-3">You received [$amount] from fellow planters on your most recent sprout!</h3>
                                        <div class="card-footer purple-bg" style={{border: "none"}}>
                                            <Link to="#"><Button className="font-weight-bold px-3 mb-5" variant="outline-light"><h4>View Fundraiser History</h4></Button></Link>
                                            <br />
                                            <img src="/cycle1.png" style={{width: "100%"}}/>
                                        </div>
                                    </div>
                                    
                                    <div className="card p-5 position-relative text-center purple-bg">
                                        <h3 className="font-weight-bold mb-3">You last helped a sprout grow with [$amount] on [date]!</h3>
                                        <div class="card-footer purple-bg" style={{border: "none"}}>
                                            <Link to="#"><Button className="font-weight-bold px-3 mb-5" variant="outline-light"><h4>View Donation History</h4></Button></Link>
                                            <br />
                                            <img src="/cycle2.png" style={{width: "100%"}}/>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="container mt-5 p-5" style={{backgroundImage: "url('/forest.jpg')", backgroundSize: "contain"}}>
                                    <h2 className="font-weight-bold">Global Donation Ranking</h2>
                                    <Link to="#"><Button className="purple-btn font-weight-bold px-5"><h4>View Rankings</h4></Button></Link>
                                </div>
                                <br />
                            
                            {/*
                                <h2>Connected Banks</h2>
                                <ul>
                                {bankItems.map((bankItem) => <li>{bankItem.bankName} <Link to={`/banks/${bankItem.bankId}/accounts`}>View Accounts</Link></li>)}
                                </ul>
                                <Link to="/link-bank-account" onClick={this.triggerPlaidLinkOpen}>Link New Bank</Link>
                        
                                <br></br>
                                <form className="register-form" onSubmit={(e) => { this.submit(); e.preventDefault(); }}>
                                <div className="error">{this.state.errorMsg}</div>
                                <input type="number" name="donationAmount" placeholder="amount" required/>
                                <button type="submit">Donate</button>
                                </form>
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
                            if no bank account connected create new button */}
                            </div>
                        }
                    </div>
            </div>
        );
    }
}

export default HomePage;
