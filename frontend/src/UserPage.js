import './UserPage.css';
import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'


class UserPage extends Component {
	 constructor(props) {
        super(props); 
        this.state = {
            username: "",
            firstname: "",
            lastname: "",
            bio:""
        }
    }


	edit() {

	}








	render() {
        return(

        	<div>
                {this.state.bio &&
                	<h2> {this.state.firstname} </h2>
                	<p> {this.state.bio} </p>
                	<Button variant="outline-light" onClick={(e) => { this.edit();}}>Edit Bio</Button>
                {!this.state.bio &&
                	<h2> {this.state.firstname} </h2>
                	<p> You do not currently have a bio, would you like to add one? </p>
                	<Button variant="outline-light" onClick={(e) => { this.edit();}}>Add Bio</Button>
            </div>
        );
    }
}

export default UserPage;