import './Login.css';
import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

class Login extends Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.flash = true;
        this.state = {
            username: "",
            password: "",
            errorMsg: ""
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value })
    }

    submit() {
        fetch('/login', {
           method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            console.log(response);
            if(response.ok) {
                response.json().then(body => {
                    if (body.mfa) {
                        this.props.history.push({
                            pathname: '/mfa',
                            state: {sig_response: body.mfa}
                        });
                    } else {
                        this.props.history.push('/home');
                    }
                });
            } else {
                response.json().then(body => {
                    this.setState({errorMsg: body.error})
                });
            }
        })
    }

    render() {
        return (
            <div>
                <Navbar  variant="dark" className="navbar-custom">
                    <Navbar.Brand onClick={(e) => {this.props.history.push('/')}} href="javascript:void(0)">Pay It Forward</Navbar.Brand>
                </Navbar>
                
                <div className="login">
                    <div className="form">
                        <form className="login-form" onSubmit={(e) => { this.submit(); e.preventDefault(); }}>
                            <img id="logo" src="/payitforwardlogo.png" />
                            <div className="error">{this.state.errorMsg}</div>
                            <input autoFocus={true} type="email" name="username" placeholder="email" value={this.state.email} onChange={this.handleChange} required/>
                            <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} required />
                            <button type="submit">login</button>
                            <p className="message">Not registered? <Link to="/register">Create an account</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;