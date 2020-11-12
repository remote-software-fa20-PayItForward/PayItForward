import React, { Component } from "react";
// import logo from "./logo.svg";
import axios from "axios";
import "./ProfilePic.css";

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import NavBar from './Navbar'


class ProfilePic extends Component{

	fileSelectedHandler = event => {
		this.setState({

		selectedFile: event.target.files[0]	
		
		})
		
	}

	fileUploadHandler = () => {
		const fileImg = new FormData();
		fileImg.append("image", this.state.selectedFile,this.state.selectedFile.name);
		axios.post("");
	}

    save() {
    	var val = this.refs.newText.value;
        fetch('/ProfilePic', {
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



render() {
	return (
		<div className="ProfilePic"> 
			<NavBar />
			<br />
		<input type="file" onChange={this.fileSelectedHandler}/>
		<button onClick={this.fileUploadHandler}>Upload Button</button>
		</div>
		);
	}
}

export default ProfilePic;