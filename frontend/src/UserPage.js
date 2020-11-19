import './UserPage.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'
import ProfilePic from './ProfilePic';

class UserPage extends Component {
	 constructor(props) {
        super(props); 
        this.state = {
            showEditFirst: false, 
            showEditLast: false,
            showEditEmail: false, 
            showEditBio: false, 
            showEditPass: false
        }
    }

	componentDidMount() {
        fetch('/user', {credentials: 'include'}).then((response) => {
            response.json().then(body => {
                this.setState({
                    username: body.username,
                    firstname: body.first,
                    lastname: body.last,
                    bio: body.bio,
                    avatar: body.avatar,
                })
            });
        }); 
    }

    cancel() {
        this.setState({
            showEditBio: false,
            showEditFirst: false, 
            showEditLast: false,
            showEditEmail: false,
            showEditPass: false
        })
    }

    save() {
    	var newBio = this.refs.inputBio.value;
        var newFirst = this.refs.inputFirst.value;
        var newLast = this.refs.inputLast.value;
        var newEmail = this.refs.inputEmail.value;
        var newPass = this.refs.inputPass.value;
        
        fetch('/UserPage', {
    		method: "POST",
    		 headers: {
    		 	'Content-type': 'application/json'
    		 },
    		 body: JSON.stringify({bio: newBio, first: newFirst, last: newLast, username: newEmail, passwordHash: newPass})
    	})
        
    	this.setState({
    		bio: newBio,
            firstname: newFirst,
            lastname: newLast,
            email: newEmail,
            showEditFirst: false, 
            showEditLast: false,
            showEditEmail: false, 
            showEditBio: false,
            showEditPass: false
    	});
    }

    render() {
    	return (
        
    		<div>
        		<NavBar />
                
                <div className="container pt-5">
                    <div className="row my-2">
                        <div className="col-lg-8 order-lg-2">
                      
                            <Tabs defaultActiveKey="profile" transition={false} id="noanim-tab-example">
                                <Tab eventKey="profile" title="Profile">
                                    <div className="py-4">
                                        <h3 className="mb-3 purple-text font-weight-bold">{this.state.firstname} {this.state.lastname}</h3>
                                        <div className="row">
                                        
                                            <div className="col-md-6 border mr-5 pt-3 rounded">
                                                <h5>About</h5>
                                                <hr />
                                                <p className="text-break">
                                                    {this.state.bio && 
                                                        this.state.bio}
                                                    {!this.state.bio &&
                                                        "No bio here yet!"}
                                                </p>
                                            </div>
                                            
                                            <div className="col-md-5 border pt-3 rounded">
                                                <h5> Achievements </h5>
                                                <hr />
                                                <h5><span class="badge badge-success ">Top 5% donor</span></h5> 
                                                <h5><span class="badge badge-primary">Top 10% donor</span></h5>
                                                <h5><span class="badge badge-dark">Top 20% donor</span></h5>
                                            </div>
                                            
                                            <div className="col-md-12 mt-4 border rounded purple-bg">
                                            
                                                <h5 className="mt-3 text-center"><span className="fa fa-clock-o ion-clock float-right" />My Sprout Stats</h5>
                                                <hr />
                                                <div className="card-group pl-3 pb-3 text-center">
                                                    <div className="card mr-3 text-dark rounded">
                                                        <div className="card-body">
                                                            <p className="lead font-weight-bold display-4 purple-text">$50 </p>
                                                            <p className="font-weight-bold"> requested sprout amount </p>
                                                        </div>
                                                    </div>
                                                    <div className="card mr-3 text-dark rounded">
                                                        <div className="card-body">
                                                            <p className="lead font-weight-bold display-4 purple-text"> 8 </p>
                                                            <p className="font-weight-bold"> planters growing your sprout </p>
                                                        </div>
                                                    </div>
                                                    <div className="card mr-3 text-dark rounded">
                                                        <div className="card-body ">
                                                            <p className="lead font-weight-bold display-4 purple-text"> $35 </p>
                                                            <p className="font-weight-bold"> current sprout amount </p>
                                                        </div>
                                                    </div>
                                                </div>
                                        
                                                <div className="text-center">
                                                    <Link to="#"><Button className="font-weight-bold px-3 mb-3" variant="outline-light"><h6>View My Sprout</h6></Button></Link>
                                                    <br />
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                              
                                <Tab eventKey="settings" title="User Settings">
                                    <div className="py-5">
                                        <form role="form">
                                        
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label form-control-label">First name</label>
                                                <div className="col-lg-9">
                                                    { !this.state.showEditFirst
                                                        ? <div> 
                                                        <div className="card card-title bg-light p-2 col-10 float-left"> {this.state.firstname} </div>
                                                        <input type="text" ref="inputFirst" defaultValue={this.state.firstname} type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" defaultValue="✎" onClick={() => this.setState({ showEditFirst : true })}/></div>
                                                        </div>
                                                 
                                                        : <div>
                                                        <input className="form-control float-left col-10" type="text" ref="inputFirst" placeholder="Enter first name" defaultValue={this.state.firstname}/>
                                                        <div className="col-1 float-right"><input type="button" className="btn" defaultValue="✔️" onClick={(e)=>{this.save();}}/></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" defaultValue="❌" onClick={(e)=>{this.cancel();}}/></div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label form-control-label">Last name</label>
                                                <div className="col-lg-9">
                                                    { !this.state.showEditLast 
                                                        ? <div> 
                                                        <div className="card card-title bg-light p-2 col-10 float-left"> {this.state.lastname} </div>
                                                        <input type="text" ref="inputLast" defaultValue={this.state.lastname} type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" defaultValue="✎" onClick={() => this.setState({ showEditLast : true })}/></div>
                                                        </div>
                                                 
                                                        : <div>
                                                        <input className="form-control float-left col-10" type="text" ref="inputLast" placeholder="Enter last name" defaultValue={this.state.lastname}/>
                                                        <div className="col-1 float-right"><input type="button" className="btn" defaultValue="✔️" onClick={(e)=>{this.save();}}/></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" defaultValue="❌" onClick={(e)=>{this.cancel();}}/></div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label form-control-label">Email</label>
                                                <div className="col-lg-9">
                                                    { !this.state.showEditEmail
                                                        ? <div> 
                                                        <div className="card card-title bg-light p-2 col-10 float-left"> {this.state.username} </div>
                                                        <input type="text" ref="inputEmail" defaultValue={this.state.username} type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" defaultValue="✎" onClick={() => this.setState({ showEditEmail : true })}/></div>
                                                        </div>
                                                 
                                                        : <div>
                                                        <input className="form-control float-left col-10" type="text" ref="inputEmail" placeholder="Enter username" defaultValue={this.state.username}/>
                                                        <div className="col-1 float-right"><input type="button" className="btn" defaultValue="✔️" onClick={(e)=>{this.save();}}/></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" defaultValue="❌" onClick={(e)=>{this.cancel();}}/></div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label form-control-label">Password</label>
                                                <div className="col-lg-9">
                                                    { !this.state.showEditPass
                                                        ? <div> 
                                                        <div className="card card-title bg-light p-2 col-10 float-left"> ●●●●●●●●● </div>
                                                        <input type="text" ref="inputPass" defaultValue={this.state.passwordHash} type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" defaultValue="✎" onClick={() => this.setState({ showEditPass : true })}/></div>
                                                        </div>
                                                 
                                                        : <div>
                                                        <input className="form-control float-left col-10" type="text" ref="inputPass" placeholder="Enter password" defaultValue={this.state.passwordHash}/>
                                                        <div className="col-1 float-right"><input type="button" className="btn" defaultValue="✔️" onClick={(e)=>{this.save();}}/></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" defaultValue="❌" onClick={(e)=>{this.cancel();}}/></div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            
                                            <div className="form-group row">
                                                <label className="col-lg-3 col-form-label form-control-label">Bio</label>
                                                <div className="col-lg-9">
                                                    { !this.state.showEditBio
                                                        ? <div> 
                                                        <div className="card card-title bg-light p-2 col-10 float-left"> {this.state.bio} </div>
                                                        <input type="text" ref="inputBio" defaultValue={this.state.bio} type="hidden"/>
                                                        <div className="col-2 float-right"><input type="button" className="btn" defaultValue="✎" onClick={() => this.setState({ showEditBio : true })}/></div>
                                                        </div>
                                                 
                                                        : <div>
                                                        <input className="form-control float-left col-10" type="text" ref="inputBio" placeholder="Enter bio" defaultValue={this.state.bio}/>
                                                        <div className="col-1 float-right"><input type="button" className="btn" defaultValue="✔️" onClick={(e)=>{this.save();}}/></div>
                                                        <div className="col-1 float-right"><input type="button" className="btn" defaultValue="❌" onClick={(e)=>{this.cancel();}}/></div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            
                                        </form>
                                    </div>
                                </Tab>
                                
                                <Tab eventKey="donation" title="Donation Settings">
                                    <div className="col-md-12 mt-4 border rounded bg-light">
                                            
                                        <h4 className="mt-4 text-center"><span className="fa fa-clock-o ion-clock float-right" />My Linked Accounts</h4>
                                        
                                        <div className="card mr-3 shadow p-3 mb-3 purple-bg rounded">
                                                        <div className="card-body ">
                                                            <h4 className="lead font-weight-bold"> CHASE COLLEGE </h4>
                                                            <h5 className="font-weight-bold"> **** 1234 </h5>
                                                        </div>
                                        </div>
                                        
                                        <div className="text-center">
                                                    <Link to="#"><Button className="font-weight-bold px-3 mb-3 btn btn-purple"><h6>+ Use Another Card</h6></Button></Link>
                                                    <br />
                                                </div>
                                    </div>

                                </Tab>
                            </Tabs>
                        </div>
                    
                        <div className="col-lg-4 order-lg-1 text-center">
                            <img src={this.state.avatar} className="mx-auto img-fluid img-circle d-block border" alt="avatar" />
                            <br />
                            <ProfilePic />
                        </div>
                    </div>
                </div>
            </div>
    	);
    }
}

export default UserPage;
