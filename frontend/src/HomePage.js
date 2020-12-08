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

const stripePromise = loadStripe('pk_test_51HhIVhKJyyCVsqcoeOjgBymqqNJRf5R1tt8U5D0Ksu0AT3lyHSrkN55DHPjAm3rN2h1xHPtq1qVwUSJFbS8RF3tU00YKHhsdI9');


class HomePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            bankItems: null,
            firstname: "",
            errorMsg: "",
            role: "",
            finishedSprouts: [],
            ongoingSprouts: [],
            latestAmount: 0
        }
        this.triggerPlaidLinkOpen = this.triggerPlaidLinkOpen.bind(this);
    }

    triggerPlaidLinkOpen() {
        this.setState({isLoading: true}, () => {
            fetch('/obtain-plaid-link-token', {credentials: 'include'}).then((response) => {
                if (!response.ok && response.status == 401) {
                    this.setState({hasAuthenticatedUser: false});
                    this.props.history.push('/login');
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
      fetch('/user').then((response) => {
          if (response.ok) {
            response.json().then(body => {
                if (!body.username) {
                    this.props.history.push('/login');
                } else {
                    this.setState({
                      hasAuthenticatedUser: true,
                      firstname: body.first,
                      role: body.role,
                      _id: body._id
                    })
                    if (this.state.role == "donor") {
                      //calculate # of sprouts donated to
                      //get latest sprout contribution
                      fetch(`/donation-record/${this.state._id}`).then((response) => {
                        response.json().then(body => {
                          let finishedSprouts = [];
                          let ongoingSprouts = [];
                  				for (let i = 0; i < body.length; i++) {
                            if (body[i].completed == true) {
                              finishedSprouts.push(body[i]);
                            } else {
                              ongoingSprouts.push(body[i]);
                            }
                          }
                          if(body.length == 0) {
                            this.setState({
                              finishedSprouts: finishedSprouts,
                              ongoingSprouts: ongoingSprouts,
                              latestAmount: 0
                            })
                          } else {
                            this.setState({
                              finishedSprouts: finishedSprouts,
                              ongoingSprouts: ongoingSprouts,
                              latestAmount: body[body.length-1].donatedAmount
                            })
                          }

                        });
                      });
                    } else {
                      //get # of active sprouts & latest amountCollected
                      fetch('/donation-request/:id').then((response) => {
                        response.json().then(body => {
                          console.log(body);
                          let ongoingSprouts = [];
                  				for (let i = 0; i < body.length; i++) {
                            if (body[i].status == "active") {
                              ongoingSprouts.push(body[i]);
                            }
                          }
                          if(ongoingSprouts.length == 0) {
                            this.setState({
                              ongoingSprouts: ongoingSprouts,
                              latestAmount: 0
                            })
                          } else {
                            this.setState({
                              ongoingSprouts: ongoingSprouts,
                              latestAmount: ongoingSprouts[ongoingSprouts.length-1].amountCollected
                            })
                          }
                        });
                      });
                    }
                }
            })
          }
          this.setState({isLoading: false});
      })
      {/*
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
      */}
    }


    render() {
        let { isLoading, bankItems, hasAuthenticatedUser } = this.state;
        return(

            <div className="bg-light" >
                <NavBar />

                {isLoading &&
                  <p>Loading...</p>
                }

                {/*user is a donor*/}
                {!isLoading && hasAuthenticatedUser == true && this.state.role == "donor" &&
                  <div class="container my-5">
                    <div class="row mt-5 border">
                      <div class="col-4 pt-3 text-center bg-white">
                          <h3 className="font-weight-bold">You've helped grow <br /> {this.state.finishedSprouts.length} Sprout(s).</h3>
                          <img src="/sprout.png" style={{width: "50%"}}/>
                      </div>
                      <div class="col-8 purple-bg p-5">
                          <h2 className="font-weight-bold">
                              Hi {this.state.firstname},
                              <br />
                              you've last helped a sprout grow by ${this.state.latestAmount}.
                          </h2>
                          <br />
                          <Link to="/UserPage#banks" className="font-weight-bold purple-bg"><h5>Update my donation preferences →</h5></Link>
                      </div>
                    </div>

                    <div class="row">
                    <div className="card-deck mt-5">
                      <div className="card p-5">
                          <h3 className="font-weight-bold">Send a Sprout</h3>
                          <p className="lead mt-3">Feeling generous? Choose to donate your change and help grow a fellow sprout!</p>
                          <div class="card-footer bg-white p-0" style={{border: "none"}}>
                              <Link to="/donation-requests"><Button className="purple-btn font-weight-bold">Let's grow!</Button></Link>
                              <img src="/grow.png" style={{width: "30%"}} className="float-right"/>
                          </div>
                      </div>
                      <div className="card p-5 text-center purple-bg">
                          <h3 className="font-weight-bold mb-3">View My Donation History</h3>
                          <div class="card-footer purple-bg" style={{border: "none"}}>
                              <Link to="/donation-history"><Button className="font-weight-bold px-3 mb-5" variant="outline-light"><h4>View History</h4></Button></Link>
                              <br />
                              <img src="/cycle2.png" style={{width: "100%"}}/>
                          </div>
                      </div>
                    </div>
                    </div>
                  </div>
                }

                {/*user is a donee*/}
                {!isLoading && hasAuthenticatedUser == true && this.state.role == "donee" &&
                  <div class="container my-5">
                    <div class="row mt-5 border">
                      <div class="col-4 pt-3 text-center bg-white">
                          <h3 className="font-weight-bold">You're currently growing {this.state.ongoingSprouts.length} Sprout(s).</h3>
                          <img src="/sprout.png" style={{width: "50%"}}/>
                      </div>
                      <div class="col-8 purple-bg p-5">
                        <h2 className="font-weight-bold">
                              Hi {this.state.firstname},
                              <br />
                              your latest sprout currently has ${this.state.latestAmount} collected.
                          </h2>
                          <br />
                          <Link to="/UserPage#banks" className="font-weight-bold purple-bg"><h5>Update my sprouting preferences→</h5></Link>
                      </div>
                    </div>

                    <div class="row">
                    <div className="card-deck mt-5">
                      <div className="card p-5">
                          <h3 className="font-weight-bold">Request a Sprout</h3>
                          <p className="lead mt-3">Select from our donation categories and plant your very own sprout!</p>
                          <div class="card-footer bg-white p-0" style={{border: "none"}}>
                              <Link to="/donation-request"><Button className="purple-btn font-weight-bold">Let's plant!</Button></Link>
                              <img src="/grow.png" style={{width: "30%"}} className="float-right"/>
                          </div>
                      </div>
                      <div className="card p-5 text-center purple-bg">
                          <h3 className="font-weight-bold mb-3">View My Sprouts</h3>
                          <div class="card-footer purple-bg" style={{border: "none"}}>
                              <Link to="/my-sprout"><Button className="font-weight-bold px-3 mb-5" variant="outline-light"><h4>View Sprouts</h4></Button></Link>
                              <br />
                              <img src="/cycle1.png" style={{width: "100%"}}/>
                          </div>
                      </div>
                    </div>
                    </div>
                  </div>
                }

                                {/*}
                                <div class="container mt-5 p-5" style={{backgroundImage: "url('/forest.jpg')", backgroundSize: "contain"}}>
                                    <h2 className="font-weight-bold">Global Donation Ranking</h2>
                                    <Link to="#"><Button className="purple-btn font-weight-bold px-5"><h4>View Rankings</h4></Button></Link>
                                </div>
                                <br />
                                */}

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
        );
    }
}

export default HomePage;
