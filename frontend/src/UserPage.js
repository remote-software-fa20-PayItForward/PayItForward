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
                    bio: body.bio
                })
            });
        }); 
    }

    edit() {
    	this.setState({
    		editing: true
    	})
    }

    save() {
    	var val = this.refs.newText.value;
    	this.setState({
    		bio: val,
    		editing: false
    	});
    	console.log("hi")
    	fetch('/UserPage', {
    		method: "POST",
    		 headers: {
    		 	'Content-type': 'application/json'
    		 },
    		 body: JSON.stringify(this.state)
    	})
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
                	<h2> {this.state.firstname} </h2>
                	{this.state.bio &&
                		<p> {this.state.bio} </p> }
                	
                	{!this.state.bio &&
                		<p> You do not currently have a bio, would you like to add one? </p>}
                	{button}
            </div>
    	);
    }

    renderEdit() {
    	return (

    		<div>{}
    			<NavBar />
    			<br />
    				<h2> {this.state.firstname} </h2>
    				{this.state.bio && 
    					<textarea ref="newText" defaultValue = {this.state.bio}></textarea>}
    				{!this.state.bio &&
    					<textarea ref="newText" placeholder="Edit bio..."></textarea>}
    				<Button variant="outline-dark" onClick={(e)=>{this.save();}}>Save Changes</Button>
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