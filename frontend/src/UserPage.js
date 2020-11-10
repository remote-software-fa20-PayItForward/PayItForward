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
            bio: ""
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

	}


	render() {
        return(

        	<div>{}
        	<NavBar />
        	<br />
                	<h2> {this.state.firstname} </h2>
                    {this.state.bio &&
                	<p> {this.state.bio} </p> }
                	
                {!this.state.bio &&
                	<p> You do not currently have a bio, would you like to add one? </p>}
                	<Button variant="outline-dark" onClick={(e) => { this.edit();}}>Add Bio</Button>
            </div>
        );
    }
}

export default UserPage;