import './UserPage.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'
import ProfilePic from './ProfilePic';

class UserPage extends Component {
	 constructor(props) {
        super(props); 
        this.state = {
            username: "",
            firstname: "",
            lastname: "",
            bio: "",
            editing: false
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
                    avatar: body.avatar ? body.avatar : "/payitforwardprofilepic.png"
                })
            });
        }); 
    }

    edit() {
    	this.setState({
    		editing: true
    	})
    }

    cancel() {
        this.setState({
            editing: false
        })
    }

    save() {
    	var val = this.refs.newText.value;
        fetch('/UserPage', {
    		method: "POST",
    		 headers: {
    		 	'Content-type': 'application/json'
    		 },
    		 body: JSON.stringify({bio: val})
    	});
    	this.setState({
    		bio: val,
    		editing: false
    	});
        console.log(this.state);
    }

    renderView() {
    	const bio = this.state.bio;
    	let button;
    	if(bio) {
    		button = <Button variant ="outline-dark" onClick={(e) => { this.edit();}}>Edit Bio</Button>;
    	} else {
    		button = <Button variant ="outline-dark" onClick={(e) => { this.edit();}}>Add Bio</Button>;
    	}
    	return (
    		<div>{}
        		<NavBar />
        		<br />
                	<h2> {this.state.firstname} <img src={this.state.avatar} width={150} height={150}/>
                    </h2>
                	{this.state.bio &&
                		<p> {this.state.bio} </p> }
                	
                	{!this.state.bio &&
                		<p> You do not currently have a bio, would you like to add one? </p>}
                	{button}
                    <br /><br />
                    <ProfilePic />
            </div>
    	);
    }

    renderEdit() {
    	return (

    		<div>{}
    			<NavBar />
    			<br />
    				<h2> {this.state.firstname} <img src={this.state.avatar}/> </h2>
    				{this.state.bio && 
    					<textarea ref="newText" defaultValue = {this.state.bio}></textarea>}
    				{!this.state.bio &&
    					<textarea ref="newText" placeholder="Edit bio..."></textarea>}
    				<Button variant="outline-dark"  style = {{color:'green'}}onClick={(e)=>{this.save();}}>Save Changes</Button>
                    <Button variant="outline-dark"  style = {{color:'red'}} onClick={(e)=>{this.cancel();}}>Cancel</Button>
    		</div>
    	)
    }



	render() {
       	if(this.state.editing) { 
       		return this.renderEdit();
       	} else { 
        	return this.renderView(); 
        }
    }
}

export default UserPage;
