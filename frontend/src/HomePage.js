import './HomePage.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'

class HomePage extends Component{
    constructor(props) {
        super(props); 
    }
    componentDidMount() {

    }

    render() {
        return(
        
            <div>
                {/*
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Pay it Forward</Navbar.Brand>
                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item" id="logout">
                        <a className="nav-link" href="#">Log Out</a>
                    </li>
                </ul>
            </div>
            
        </Navbar>
                */}
            <NavBar />
            <br />
                <h1>Welcome</h1>
            </div>
        );
    }
}

export default HomePage;