import './FrontPage.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'

class FrontPage extends Component{
    
    componentDidMount() {
         fetch('/user', {credentials: 'include'}).then((response) => {
            response.json().then(body => {
                if (body.username) {
                    this.props.history.push('/home');
                }
            });
        }); 
    }
    
    render() {

        return(
        
            <div>
                <NavBar />
                <br />
                    <div className="container p-3 m-md-3 position-relative overflow-hidden ">
                        <div className="col-8 p-lg-5 my-5 float-left w-50">
                          <h1 className="display-4 font-weight-bold purple-text">Let's Pay It Forward.</h1>
                            <br />
                          <p className="lead font-weight-normal">Donate change from your debit and credit card purchases to help your peers (and receive donations too!).</p>
                          <Link to="/login"><Button className="purple-btn font-weight-bold px-5" >Start Now</Button></Link>
                        </div>
                        <div className="col-4 float-right w-40 mx-auto">
                            <img src="/payitforwardlogo.png" style={{width: "150%"}}/>
                        </div>
                    </div>
                    
                    <div className="card-group">
                        <div className="card purple-bg justify-content-center">
                            <img src="/link.jpg" style={{marginLeft: "30%", width: "50%"}} />
                        </div>
                        <div className="card border-0">
                            <div className="card-body">
                                <h1 className="purple-text display-5 font-weight-bold pt-3 pl-3">How Pay It Forward Works: </h1>
                                <div className="p-5">
                                <h3 className="display-5 font-weight-bold">Link your bank and cards. </h3>
                                <p className="lead">Securely link your bank account, debit, or credit cards through the app. This allows the app to donate the change from your transactions.</p>
                                <Link to="#"><Button className="purple-btn font-weight-bold px-5" >Learn More</Button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-group">
                        <div className="card">
                            <div className="card-body">
                                <div className="p-5">
                                <h3 className="display-5 font-weight-bold pt-5">Select Your Donation Category. </h3>
                                <p className="lead">Select the donation category you want your change to be donated to. Or create your own donation request under a specific donation category.</p>
                                <Link to="#"><Button className="purple-btn font-weight-bold px-5" >Learn More</Button></Link>
                                </div>
                            </div>
                        </div>
                        <div className="card purple-bg border justify-content-center">
                            <img src="/donate.png" style={{marginLeft: "20%", width: "70%"}} />
                        </div>
                    </div>
                    
                    <div className="card-group">
                        <div className="card purple-bg border justify-content-center">
                            <img src="/impact.png" style={{marginLeft: "20%", width: "70%"}} />
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <div className="p-5">
                                <h3 className="display-5 font-weight-bold pt-5">Make An Impact.</h3>
                                <p className="lead">Pay It Forward will accrue your change until a specified threshold is reached. The app will then send a deposit directly to the selected donation category.</p>
                                <Link to="#"><Button className="purple-btn font-weight-bold px-5" >Learn More</Button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="position-relative bg-light overflow-hidden p-5 text-center">
                        
                        <div className="py-5">
                            <h1 className="display-5 font-weight-bold">Created by <span className="purple-text">NYU Students</span>, for <span className="purple-text">NYU Students</span></h1>
                            <p className="lead">Meet the team who worked on the app!</p>
                        </div>
                        
                        <div className="card-deck">
                            <div className="card">
                              <img className="card-img-top" src="https://github.com/jkh394.png" alt="Card image cap" />
                              <div className="card-body">
                              </div>
                              <div className="card-footer">
                                <h3 className="card-title purple-text">Joanne Han</h3>
                                <p className="card-text">A student of the Collaborating Remotely class led by Professors Evan Korth & Nolan Filter.</p>
                              </div>
                            </div>
                            
                            <div className="card">
                              <img className="card-img-top" src="https://github.com/mstillman9.png" alt="Card image cap" />
                              <div className="card-body">
                              </div>
                              <div className="card-footer">
                                <h3 className="card-title purple-text">Matthew Stillman</h3>
                                <p className="card-text">A student of the Collaborating Remotely class led by Professors Evan Korth & Nolan Filter.</p>
                              </div>
                            </div>
                            
                           <div className="card">
                              <img className="card-img-top" src="https://github.com/jordanz2k.png" alt="Card image cap" />
                              <div className="card-body">
                              </div>
                              <div className="card-footer">
                                <h3 className="card-title purple-text">Jordan Zhao</h3>
                                <p className="card-text">A student of the Collaborating Remotely class led by Professors Evan Korth & Nolan Filter.</p>
                              </div>
                            </div>
                        </div>
                        
                        <div className="card-deck pt-5">
                            <div className="card">
                              <img className="card-img-top" src="https://github.com/al5361.png" alt="Card image cap" />
                              <div className="card-body">
                              </div>
                              <div className="card-footer">
                                <h3 className="card-title purple-text">Allen Lin</h3>
                                <p className="card-text">A student of the Collaborating Remotely class led by Professors Evan Korth & Nolan Filter.</p>
                              </div>
                            </div>
                            
                            <div className="card">
                              <img className="card-img-top" src="https://github.com/LeeBoodoo.png" alt="Card image cap" />
                              <div className="card-body">
                              </div>
                              <div className="card-footer">
                                <h3 className="card-title purple-text">Lee Boodoo</h3>
                                <p className="card-text">A student of the Collaborating Remotely class led by Professors Evan Korth & Nolan Filter.</p>
                              </div>
                            </div>
                            
                            <div className="card">
                              <img className="card-img-top" src="https://github.com/benrkaplan.png" alt="Card image cap" />
                              <div className="card-body">
                              </div>
                              <div className="card-footer">
                                <h3 className="card-title purple-text">Ben Kaplan</h3>
                                <p className="card-text">A student of the Collaborating Remotely class led by Professors Evan Korth & Nolan Filter.</p>
                              </div>
                            </div>
                        </div>
                        
                    </div>
                    
                    <div className="position-relative overflow-hidden p-5 m-5 text-center">
                        
                        <h3 className="display-5 mt-5 font-weight-bold">Ready to get started?</h3>
                        <p cclassName="lead font-weight-normal mt-3">Make an impact with little effort! <br /> Join the Pay It Forward community now.</p>
                        <Link to="/login"><Button className="purple-btn font-weight-bold px-5" >Start Now</Button></Link>

                    </div>
            </div>
        );
    }
}

export default FrontPage;
