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
    
    render() {

        return(
        
            <div>
                <NavBar />
                <br />
                    <div className="position-relative overflow-hidden p-3 m-md-3 ">
                        <div className="p-lg-5 my-5 float-left w-50">
                          <h1 className="display-4 font-weight-bold purple-text">Let's Pay It Forward.</h1>
                            <br />
                          <p className="lead font-weight-normal">Donate change from your debit and credit card purchases to help your peers (and receive donations too!).</p>
                          <Link to="/login"><Button className="purple-btn font-weight-bold px-5" >Start Now</Button></Link>
                        </div>
                        <div className="float-right w-40 mx-auto">
                            <img src="/payitforwardlogo.png" />
                        </div>
                    </div>
                    
                    <div className="position-relative overflow-hidden ">
                        <div className="purple-bg float-left mx-auto p-lg-5 w-50 text-center text-white overflow-hidden">
                            <img src="/link.jpg" width={400} />
                        </div>
                        <div className="p-lg-5 float-right w-50 overflow-hidden">
                            <h1 className="purple-text display-5 font-weight-bold">How Pay It Forward Works: </h1>
                          <div className="p-5">
                            <h3 className="display-5 font-weight-bold">Link your bank and cards. </h3>
                            <p className="lead">Securely link your bank account, debit, or credit cards through the app. This allows the app to donate the change from your transactions.</p>
                            <Link to="#"><Button className="purple-btn font-weight-bold px-5" >Learn More</Button></Link>
                          </div>
                        </div>
                    </div>
                    
                    <div className="position-relative overflow-hidden">
                        <div className="purple-bg float-right  mx-auto p-lg-5 w-50 text-center text-white overflow-hidden">
                            <img src="/donate.png" width={500} />
                        </div>
                        <div className="p-lg-5 float-left w-50 overflow-hidden">
                            <br />
                          <div className="p-5">
                            <h3 className="display-5 font-weight-bold">Select Your Donation Category. </h3>
                            <p className="lead">Select the donation category you want your change to be donated to. Or create your own donation request under a specific donation category.</p>
                            <Link to="#"><Button className="purple-btn font-weight-bold px-5" >Learn More</Button></Link>
                          </div>
                        </div>
                    </div>
                    
                    <div className="position-relative overflow-hidden">
                        <div className="purple-bg float-left  mx-auto p-lg-5 w-50 text-center text-white overflow-hidden">
                            <img src="/impact.png" width={400} />
                        </div>
                        <div className="p-lg-5 float-right w-50 overflow-hidden">
                            <br />
                          <div className="p-5">
                            <h3 className="display-5 font-weight-bold">Make An Impact. </h3>
                            <p className="lead">Pay It Forward will accrue your change until a specified threshold is reached. The app will then send a deposit directly to the selected donation category.</p>
                            <Link to="#"><Button className="purple-btn font-weight-bold px-5">Learn More</Button></Link>
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
                              <img className="card-img-top" src="/nyu.png" alt="Card image cap" />
                              <div className="card-body">
                              </div>
                              <div className="card-footer">
                                <h3 className="card-title purple-text">Joanne Han</h3>
                                <p className="card-text">A student of the Collaborating Remotely class led by Professors Evan Korth & Nolan Filter.</p>
                              </div>
                            </div>
                            
                            <div className="card">
                              <img className="card-img-top" src="/nyu.png" alt="Card image cap" />
                              <div className="card-body">
                              </div>
                              <div className="card-footer">
                                <h3 className="card-title purple-text">Matthew Stillman</h3>
                                <p className="card-text">A student of the Collaborating Remotely class led by Professors Evan Korth & Nolan Filter.</p>
                              </div>
                            </div>
                            
                           <div className="card">
                              <img className="card-img-top" src="/nyu.png" alt="Card image cap" />
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
                              <img className="card-img-top" src="/nyu.png" alt="Card image cap" />
                              <div className="card-body">
                              </div>
                              <div className="card-footer">
                                <h3 className="card-title purple-text">Allen Lin</h3>
                                <p className="card-text">A student of the Collaborating Remotely class led by Professors Evan Korth & Nolan Filter.</p>
                              </div>
                            </div>
                            
                            <div className="card">
                              <img className="card-img-top" src="/nyu.png" alt="Card image cap" />
                              <div className="card-body">
                              </div>
                              <div className="card-footer">
                                <h3 className="card-title purple-text">Lee Boodoo</h3>
                                <p className="card-text">A student of the Collaborating Remotely class led by Professors Evan Korth & Nolan Filter.</p>
                              </div>
                            </div>
                            
                            <div className="card">
                              <img className="card-img-top" src="/nyu.png" alt="Card image cap" />
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
