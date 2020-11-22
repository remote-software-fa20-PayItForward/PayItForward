import './UserPage.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'
import ProfilePic from './ProfilePic';
import { findAllByTestId } from '@testing-library/react';

class UserPage extends Component {
	 constructor(props) {
        super(props); 
        this.state = {
            showEditFirst: false, 
            showEditLast: false,
            showEditName: false,
            showEditEmail: false, 
            showEditBio: false, 
            showEditPass: false,
            showEditAvatar: false,
            username: "",
            first: "",
            last: "",
            bio: "",
            avatar: "/profile.jpg",
            amount: 0
        }
    }

	componentDidMount() {
        Promise.all([
            fetch('/user', {credentials: 'include'}),
            fetch('/donation-request')
         ]).then(allResponses => {
             allResponses[0].json().then(body => {
                 if (!body.username) {
                     this.props.history.push('/login');
                 }
                 this.setState({
                     username: body.username,
                     first: body.first,
                     last: body.last,
                     bio: body.bio,
                     avatar: body.avatar ? body.avatar : "/profile.jpg",
                 })
             })
             allResponses[1].json().then(body => {
                 if (body) {
                     this.setState({
                        amount: body.amount
                     })
                 } else {
                     this.setState({
                        amount: 0
                     })
                 }
             })
         })
         /*
        fetch('/user', {credentials: 'include'}).then((response) => {
            response.json().then(body => {
                if (!body.username) {
                    this.props.history.push('/login');
                }
                this.setState({
                    username: body.username,
                    firstname: body.first,
                    lastname: body.last,
                    bio: body.bio,
                    avatar: body.avatar ? body.avatar : "/profile.jpg",
                    mfaEnabled: body.mfaEnabled
                })
            });
        }); 
        */
    }

    cancel() {
        this.setState({
            showEditBio: false,
            showEditName: false,
            showEditEmail: false,
            showEditPass: false
        })
    }

    save(e) {
        var body = {};
        switch (e.target.id) {
            case "nameform":
                var newFirst = this.refs.inputFirst.value;
                var newLast = this.refs.inputLast.value;
                body.first = newFirst;
                body.last = newLast;
                break;
            case "emailform":
                var newEmail = this.refs.inputEmail.value;
                body.username = newEmail;
                break;
            case "passwordform":
                var newPass = this.refs.inputPass.value;
                body.password = newPass;
                break;
            case "bioform":
                var newBio = this.refs.inputBio.value;
                body.bio = newBio;
                break;
        }
        
        fetch('/user/update', {
    		method: "POST",
    		 headers: {
    		 	'Content-type': 'application/json'
    		 },
    		 body: JSON.stringify(body)
    	}).then((response) => {
            if (response.ok) {
                this.setState(body);
                this.setState({
                    showEditName: false,
                    showEditEmail: false, 
                    showEditBio: false,
                    showEditPass: false
                });
            }
        })
    }

    mfa() {
        fetch('/user/update', {
    		method: "POST",
    		 headers: {
    		 	'Content-type': 'application/json'
    		 },
    		 body: JSON.stringify({mfaEnabled: !this.state.mfaEnabled})
        }).then((response) => {
            if (response.ok) {
                this.setState({
                    mfaEnabled: !this.state.mfaEnabled
                })
            }
        });
    }

    render() {
    	return (
        
    		<div>
        		<NavBar />
                
                <Container className="pt-5">
                    <Row className="my-2">
                        <Col lg={8} className="order-lg-2">
                      
                            <Tabs defaultActiveKey="profile" transition={false} id="noanim-tab-example">
                                <Tab eventKey="profile" title="Profile">
                                    <div className="py-4">
                                        <h3 className="mb-3 purple-text font-weight-bold">{this.state.first} {this.state.last}</h3>
                                        <Row>
                                        
                                            <Col md={6} className="border mr-5 pt-3 rounded">
                                                <h5>About</h5>
                                                <hr />
                                                <p className="text-break">
                                                    {this.state.bio && 
                                                        this.state.bio}
                                                    {!this.state.bio &&
                                                        "No bio here yet!"}
                                                </p>
                                            </Col>
                                            
                                            <Col className="border pt-3 rounded">
                                                <h5> Achievements </h5>
                                                <hr />
                                                <h5><Badge variant="success ">Top 5% donor</Badge></h5> 
                                                <h5><Badge variant="primary">Top 10% donor</Badge></h5>
                                                <h5><Badge variant="dark">Top 20% donor</Badge></h5>
                                            </Col>
                                            
                                            <Col md={12} className="mt-4 border rounded purple-bg">
                                            
                                                <h5 className="mt-3 text-center"><span className="fa fa-clock-o ion-clock float-right" />My Sprout Stats</h5>
                                                <hr />
                                                <CardGroup className="pl-3 pb-3 text-center">
                                                    <Card className="mr-3 text-dark rounded">
                                                        <Card.Body>
                                                            <p className="lead font-weight-bold display-4 purple-text">${this.state.amount} </p>
                                                            <p className="font-weight-bold"> requested sprout amount </p>
                                                        </Card.Body>
                                                    </Card>
                                                    <Card className="mr-3 text-dark rounded">
                                                        <Card.Body>
                                                            <p className="lead font-weight-bold display-4 purple-text"> 8 </p>
                                                            <p className="font-weight-bold"> planters growing your sprout </p>
                                                        </Card.Body>
                                                    </Card>
                                                    <Card className="mr-3 text-dark rounded">
                                                        <Card.Body>
                                                            <p className="lead font-weight-bold display-4 purple-text"> $35 </p>
                                                            <p className="font-weight-bold"> current sprout amount </p>
                                                        </Card.Body>
                                                    </Card>
                                                </CardGroup>
                                        
                                                <div className="text-center">
                                                    <Link to="#"><Button className="font-weight-bold px-3 mb-3" variant="outline-light"><h6>View My Sprout</h6></Button></Link>
                                                    <br />
                                                </div>
                                                
                                            </Col>
                                        </Row>
                                    </div>
                                </Tab>
                              
                                <Tab eventKey="settings" title="User Settings">
                                    <div className="py-5">
                                            {/*
                                            <Row className="form-group">
                                                <label className="col-lg-3 col-form-label form-control-label">First name</label>
                                                <Col lg={9}>
                                                    { !this.state.showEditFirst
                                                        ? <div> 
                                                        <Card className="card-title bg-light p-2 col-10 float-left"> {this.state.first} </Card>
                                                        <input type="text" ref="inputFirst" defaultValue={this.state.first} type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" value="✎" onClick={() => this.setState({ showEditFirst : true })}/></div>
                                                        </div>
                                                 
                                                        : <form id="firstform" onSubmit={(e)=>{this.save(e);e.preventDefault();}}>
                                                        <input className="form-control float-left col-10" type="text" ref="inputFirst" placeholder="Enter first name" defaultValue={this.state.first} required/>
                                                        <div className="col-1 float-right"><input type="submit" className="btn" value="✔️" /></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" value="❌" onClick={() => this.setState({ showEditFirst : false })}/></div>
                                                        </form>
                                                    }
                                                </Col>
                                            </Row>
                                            
                                            <Row className="form-group">
                                                <label className="col-lg-3 col-form-label form-control-label">Last name</label>
                                                <Col lg={9}>
                                                    { !this.state.showEditLast 
                                                        ? <div> 
                                                        <Card className="card-title bg-light p-2 col-10 float-left"> {this.state.last} </Card>
                                                        <input type="text" ref="inputLast" defaultValue={this.state.last} type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" value="✎" onClick={() => this.setState({ showEditLast : true })}/></div>
                                                        </div>
                                                 
                                                        : <form id="lastform" onSubmit={(e)=>{this.save(e);e.preventDefault();}}>
                                                        <input className="form-control float-left col-10" type="text" ref="inputLast" placeholder="Enter last name" defaultValue={this.state.last} required/>
                                                        <div className="col-1 float-right"><input type="submit" className="btn" value="✔️" /></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" value="❌" onClick={() => this.setState({ showEditLast : false })}/></div>
                                                        </form>
                                                    }
                                                </Col>
                                            </Row>
                                            */}
                                            <Row className="form-group">
                                                <label className="col-lg-3 col-form-label form-control-label">Name</label>
                                                <Col lg={9}>
                                                    { !this.state.showEditName 
                                                        ? <div> 
                                                        <Card className="card-title bg-light p-2 col-5 float-left"> {this.state.first} </Card>
                                                        <Card className="card-title bg-light p-2 col-5 float-left"> {this.state.last} </Card>
                                                        <input type="text" ref="inputFirst" defaultValue={this.state.first} type="hidden"/>
                                                        <input type="text" ref="inputLast" defaultValue={this.state.last} type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" value="✎" onClick={() => this.setState({ showEditName : true })}/></div>
                                                        </div>
                                                 
                                                        : <form id="nameform" onSubmit={(e)=>{this.save(e);e.preventDefault();}}>
                                                        <input className="form-control float-left col-5" type="text" ref="inputFirst" placeholder="Enter first name" defaultValue={this.state.first} required/>
                                                        <input className="form-control float-left col-5" type="text" ref="inputLast" placeholder="Enter last name" defaultValue={this.state.last} required/>
                                                        <div className="col-1 float-right"><input type="submit" className="btn" value="✔️" /></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" value="❌" onClick={() => this.setState({ showEditName : false })}/></div>
                                                        </form>
                                                    }
                                                </Col>
                                            </Row>
                                            
                                            <Row className="form-group">
                                                <label className="col-lg-3 col-form-label form-control-label">Email</label>
                                                <Col lg={9}>
                                                    { !this.state.showEditEmail
                                                        ? <div> 
                                                        <Card className="card-title bg-light p-2 col-10 float-left"> {this.state.username} </Card>
                                                        <input type="text" ref="inputEmail" defaultValue={this.state.username} type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" value="✎" onClick={() => this.setState({ showEditEmail : true })}/></div>
                                                        </div>
                                                 
                                                        : <form id="emailform" onSubmit={(e)=>{this.save(e);e.preventDefault();}}>
                                                        <input className="form-control float-left col-10" type="text" ref="inputEmail" placeholder="Enter username" defaultValue={this.state.username} required />
                                                        <div className="col-1 float-right"><input type="submit" className="btn" value="✔️" /></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" value="❌" onClick={() => this.setState({ showEditEmail : false })}/></div>
                                                        </form>
                                                    }
                                                </Col>
                                            </Row>
                                            
                                            <Row className="form-group">
                                                <label className="col-lg-3 col-form-label form-control-label">Password</label>
                                                <Col lg={9}>
                                                    { !this.state.showEditPass
                                                        ? <div> 
                                                        <Card className="card-title bg-light p-2 col-10 float-left"> ●●●●●●●●● </Card>
                                                        <input type="text" ref="inputPass" type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" value="✎" onClick={() => this.setState({ showEditPass : true })}/></div>
                                                        </div>
                                                 
                                                        : <form id="passwordform" onSubmit={(e)=>{this.save(e);e.preventDefault();}} onInput={(e)=>{if (e.target.form.elements.password1.value == e.target.form.elements.password2.value) e.target.form.elements.password2.setCustomValidity(""); else e.target.form.elements.password2.setCustomValidity("Passwords do not match");}}>
                                                        <input className="form-control float-left col-10" type="password" ref="inputPass" name="password1" placeholder="Enter password" required />
                                                        <input className="form-control float-left col-10" type="password" ref="inputPass" name="password2" placeholder="Confirm password" required />
                                                        <div className="col-1 float-right"><input type="submit" className="btn" value="✔️" /></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" value="❌" onClick={() => this.setState({ showEditPass : false })}/></div>
                                                        </form>
                                                    }
                                                </Col>
                                            </Row>
                                            
                                            <Row className="form-group">
                                                <label className="col-lg-3 col-form-label form-control-label">Bio</label>
                                                <Col lg={9}>
                                                    { !this.state.showEditBio
                                                        ? <div> 
                                                        <Card className="card-title bg-light p-2 col-10 float-left"> {this.state.bio} </Card>
                                                        <input type="text" ref="inputBio" defaultValue={this.state.bio} type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" value="✎" onClick={() => this.setState({ showEditBio : true })}/></div>
                                                        </div>
                                                 
                                                        : <form id="bioform" onSubmit={(e)=>{this.save(e);e.preventDefault();}}>
                                                        <input className="form-control float-left col-10" type="text" ref="inputBio" placeholder="Enter bio" defaultValue={this.state.bio}/>
                                                        <div className="col-1 float-right"><input type="submit" className="btn" value="✔️"/></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" value="❌" onClick={() => this.setState({ showEditBio : false })}/></div>
                                                        </form>
                                                    }
                                                </Col>
                                            </Row>

                                            <Row className="form-group">
                                                <label className="col-lg-3 col-form-label form-control-label">Two-Factor Authentication</label>
                                                <Col lg={9}>
                                                    <Card className="card-title bg-light p-2 col-10 float-left">{this.state.mfaEnabled ? "Enabled" : "Disabled"}</Card>
                                                    <div className="col-2 float-right"><input type="button" className="btn" value={this.state.mfaEnabled ? "Disable" : "Enable"} onClick={(e)=>{this.mfa();}} /></div>
                                                </Col>
                                            </Row>
                                            
                                    </div>
                                </Tab>
                                
                                <Tab eventKey="donation" title="Donation Settings">
                                    <Col md={12} className="mt-4 border rounded bg-light">
                                            
                                        <h4 className="mt-4 text-center"><span className="fa fa-clock-o ion-clock float-right" />My Linked Accounts</h4>
                                        
                                        <Card className="mr-3 shadow p-3 mb-3 purple-bg rounded">
                                                        <Card.Body>
                                                            <h4 className="lead font-weight-bold"> CHASE COLLEGE </h4>
                                                            <h5 className="font-weight-bold"> **** 1234 </h5>
                                                        </Card.Body>
                                        </Card>
                                        
                                        <div className="text-center">
                                                    <Link to="#"><Button className="font-weight-bold px-3 mb-3 btn btn-purple"><h6>+ Use Another Card</h6></Button></Link>
                                                    <br />
                                                </div>
                                    </Col>

                                </Tab>
                            </Tabs>
                        </Col>
                    
                        <Col lg={4} className="order-lg-1 text-center">
                            <img src={this.state.avatar} className="mx-auto img-fluid img-circle d-block border" onClick={(e)=>{this.setState({showEditAvatar: true})}} alt="avatar" />
                            <br />
                            { this.state.showEditAvatar ?
                            <ProfilePic />
                            :
                            <small>Click to change your profile picture</small>
                            }
                            { this.state.showEditAvatar &&
                            <Button onClick={(e)=>{this.setState({showEditAvatar: false})}}>Close</Button>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
    	);
    }
}

export default UserPage;
