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
      file: null
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }
  render() {
    return (
      <div className="ProfilePic">
      	<NavBar />
		<br />
        <input type="file" onChange={this.handleChange}/>
        <button onClick={this.fileUploadHandler}>Upload Button</button>
        <img src={this.state.file}/>
      </div>
    );
  }
}


export default ProfilePic;