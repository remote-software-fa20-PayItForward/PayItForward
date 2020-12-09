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
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import CardGroup from 'react-bootstrap/CardGroup';
import Alert from 'react-bootstrap/Alert';

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
            latestAmount: 0,
            setShow: false,
            alerted: null
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
                              latestAmount: (body[body.length-1].donatedAmount).toFixed(2)
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
                            } else if (body[i].status == "completed" && body[i].alerted == false) {
                              //hasn't been alerted yet about completed donation request
                              this.setState({
                                alerted: body[i]._id
                              })
                              console.log(this.state.alerted);
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
                              latestAmount: (ongoingSprouts[ongoingSprouts.length-1].amountCollected).toFixed(2)
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

    setShow(show) {
      //set donation request alerted to true
      if (show == true) {
        fetch(`/donation-request/alerted/${this.state.alerted}`, {
          method: "POST",
          headers: {
            'Content-type': 'application/json'
          },
        }).then((response) => {
          response.json().then(body => {
            console.log(body);
            this.setState({
              completed: body
            })
          });
        });
      }

      //show completed donation request
      this.setState({
        setShow: show,
        alerted: null
      })
    }


    render() {
        let { isLoading, bankItems, hasAuthenticatedUser } = this.state;
        const handleClose = () => this.setShow(false);
        const handleShow = () => this.setShow(true);
        return(

            <div className="bg-light" >
                <NavBar />

                {isLoading &&
                  <p>Loading...</p>
                }

                {this.state.completed &&
                <Modal show={this.state.setShow} onHide={handleClose} className="mt-5 ">
                  <Modal.Header closeButton className="border-0"></Modal.Header>
                  <Modal.Body>
                  <Card className="mt-3 shadow-lg purple-bg" style={{width: '100%'}}>
                    <Row className="justify-content-center mt-3">
                      <h2><Badge variant="secondary">Completed</Badge></h2>
                    </Row>

                    <div className="border mt-3 bg-white" >
                        <Card.Img variant="top" src={this.state.completed.image} alt="Card image cap" style={{width: '50%', marginLeft: '25%'}}/>
                    </div>

                    <Col md={12}>
                        <h3 className="my-4 text-center">{this.state.completed.name}</h3>
                        <CardGroup className="pl-3 pb-3 text-center">
                            <Card className="mr-3 text-dark rounded text-left">
                                <Card.Body>
                                    <p className="lead font-weight-bold purple-text">Sprout Description: </p>
                                    <p className=""> {this.state.completed.description} </p>

                                    <h4 className="float-left"><Badge variant="primary">#{this.state.completed.category}</Badge></h4>

                                </Card.Body>
                            </Card>
                        </CardGroup>
                    </Col>

                    <Col md={12}>
                      <CardGroup className="pl-3 pb-1 text-center">
                        <Card className="mr-3 text-dark rounded">
                          <Card.Body>
                            <p className="lead font-weight-bold display-4 purple-text"> ${this.state.completed.amount} </p>
                            <p className="font-weight-bold"> requested sprout amount </p>
                          </Card.Body>
                        </Card>
                      </CardGroup>
                    </Col>

                    <Col md={12}>
                      <CardGroup className="pl-3 pb-1 text-center">
                        <Card className="mr-3 text-dark rounded">
                          <Card.Body>
                            <p className="lead font-weight-bold display-4 purple-text"> {this.state.completed.subscribers.length}</p>
                            <p className="font-weight-bold"> planters growing your sprout </p>
                          </Card.Body>
                        </Card>
                      </CardGroup>
                      </Col>

                      <Col md={12}>
                        <CardGroup className="pl-3 pb-1 text-center">
                        <Card className="mr-3 text-dark rounded">
                          <Card.Body>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style={{width: `${100}%`}} aria-valuenow={100} aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <p className="lead font-weight-bold display-4 purple-text"> ${this.state.completed.amountCollected} </p>
                            <p className="font-weight-bold"> current sprout amount </p>
                          </Card.Body>
                        </Card>
                        </CardGroup>
                    </Col>
                  </Card>
                  </Modal.Body>
                  <Modal.Footer className="text-center justify-content-center">
                    <Button className="purple-bg" onClick={handleClose}>
                      Got it!
                    </Button>
                  </Modal.Footer>
                </Modal>
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
                {this.state.alerted &&
                <Alert variant="success" role="alert">
                  <h4>Congratulations! Your sprout has reached its goal amount - click <a href="#" onClick={(e) => {this.setShow(true)}}>here</a> to view it.</h4>
                </Alert>
                }
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
