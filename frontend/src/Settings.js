import './Settings.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'
import ProfilePic from './ProfilePic';

class Settings extends Component {
	 constructor(props) {
        super(props); 
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            username: "",
            firstname: "",
            lastname: "",
            password: "",
            newpassword: "",
            newpasswordconfirm: "",
            bio: "",
            errorMsg: ""
        }
    }

    componentDidMount() {
        fetch('/user', {credentials: 'include'}).then((response) => {
            response.json().then(body => {
                this.setState({
                    username: body.username,
                    firstname: body.first,
                    lastname: body.last,
                    bio: body.bio,
                    avatar: body.avatar ? body.avatar : "/payitforwardprofilepic.png"
                })
            });
        }); 
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value })
    }

    submit(e) {
        fetch('/Settings', {
           method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            console.log(response);
            if (response.ok) {
                this.props.history.push('/');
            } else {
                response.json().then(body => {
                    this.setState({errorMsg: body.error})
                })
            }
        })
    }





    render(){
    	return(
    		<div>{}
    			<NavBar />




    			<div className="">
                    <div className="form">
                        <form className="register-form" onSubmit={(e) => {this.submit();  e.preventDefault(); }}>
                            <br />
                            <div className="error">{this.state.errorMsg}</div>
                            <input type="password" name="newpassword" placeholder="new password" value={this.state.newpassword} onChange={this.handleChange} required />
                            <input type="password" name="newpasswordconfirm" placeholder="confirm password" value={this.state.newpasswordconfirm} onChange={this.handleChange} required />
    						<Button variant="outline-dark"  style = {{color:'green'}}>Update Password</Button>
                        </form>
                    </div>
                </div>

    			

    			<br></br>
    			<p> Change Profile Picture</p>
    			<ProfilePic />
    		</div>
    	)
    }
}

export default Settings;