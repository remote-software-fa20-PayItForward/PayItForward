import './HomePage.css';
import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.state = {
            email: "",
            password: ""
        }
    }

    submit() {
        //TODO - Code to submit to backend
    }

    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/">Pay it Forward</Navbar.Brand>
                </Navbar>
                
                <div className="homepage">
                    <div className="form">
                        <form className="login-form" onSubmit={(e) => { this.submit(); e.preventDefault(); }}>
                            <img id="logo" src="/payitforwardlogo.png" />
                            <br />
                            <input autofocus="true" type="email" name="username" placeholder="email" value={this.state.email} required/>
                            <input type="password" name="password" placeholder="password" value={this.state.password} required />
                            <button type="submit">login</button>
                            <p className="message">Not registered? <Link to="/register">Create an account</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default HomePage;