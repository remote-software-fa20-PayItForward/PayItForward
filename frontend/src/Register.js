import './Register.css';
import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

class Register extends Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.state = {
            email: "",
            password: "",
            passwordconfirm: "",
            firstname: "",
            lastname: "",
        }
    }

    submit() {
        //TODO - Code to submit to backend
    }

    render() {
        return(
        
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/">Pay it Forward</Navbar.Brand>
                </Navbar>
                
                <div className="homepage">
                    <div className="form">
                        <form className="register-form" onSubmit={(e) => { this.submit(); e.preventDefault(); }}>
                            <br />
                            <div style={{float: 'left'}}>
                            <input autofocus="true" type="text" name="first" placeholder="first name" size={10} value={this.state.firstname} required />
                            </div>
                            <div style={{float: 'right'}}>
                            <input type="text" name="last" placeholder="last name" size={10} value={this.state.lastname} required />
                            </div>
                            <input type="email" name="username" placeholder="email" value={this.state.email} required />
                            <input type="password" name="password" placeholder="create a password" value={this.state.password} required />
                            <input type="password" name="passwordconfirm" placeholder="confirm password" value={this.state.passwordconfirm} required />
                            <button type="submit">create account</button>
                            <p className="message">Already registered? <Link to="/">Sign In</Link></p>
                        </form>
                    </div>
                </div>
                
            </div>
        
        );
    }
}

export default Register;