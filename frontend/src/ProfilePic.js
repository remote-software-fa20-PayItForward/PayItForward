import React, { Component } from "react";
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


class ProfilePic extends React.Component{


  constructor(props){
    super(props)
    this.state = {
      data: "",
      name: '',
      file: null,
      addPic: true
    }
    this.handleChange = this.handleChange.bind(this)
    this.submit = this.submit.bind(this);
  }
  handleChange(event) {
    var file = event.target.files[0];
    this.setState({
      data: file,
      file: URL.createObjectURL(file),
      name: file.name
    })
  }

  submit() {
    if (this.state.data) {
      const formData = new FormData(); 
      formData.append( 
        "myFile", 
        this.state.data, 
        this.state.data.name 
      ); 
      axios.post('/user/profilephoto', formData).then(function(response) {
        
      });
    }
    this.setState({
    	avatar: this.state.file,
    	addPic: false
    	});
  }

  addImage() {
  	this.setState({
    	addPic: true
    	})
  }
  
  render() {
    return (
      <div className="ProfilePic">
        <input type="file" onChange={this.handleChange}/>
        <button onClick={this.submit}>Upload</button>
        <img src={this.state.file}/>
      </div>
    );
  }
}


export default ProfilePic;
