import './Navbar.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import ProfilePic from './ProfilePic';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            firstname: "",
            lastname: ""
        }
        this.logout = this.logout.bind(this);
    }
    componentDidMount() {
        fetch('/user', {credentials: 'include'}).then((response) => {
            response.json().then(body => {
                this.setState({
                    username: body.username,
                    firstname: body.first,
                    lastname: body.last,
                    avatar: body.avatar ? body.avatar : "/profile.jpg"
                })
            });
        });
    }

    logout() {
        fetch('/logout',{credentials: 'include'}).then((response) => {
            this.props.history.push('/login');
        });
    }

    checkAuth() {
        fetch('/user', {credentials: 'include'}).then((response) => {
            response.json().then(body => {
                if (body.username) {
                    this.props.history.push('/home');
                } else {
                    this.props.history.push('/');
                }
            });
        });
    }

    render() {
        return(
            <Navbar variant="dark" className="navbar-custom">
                <Navbar.Brand onClick={(e) => this.checkAuth()} href="javascript:void(0)">Pay It Forward</Navbar.Brand>
                {this.state.username &&
                <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="pr-3">Welcome back, {this.state.firstname} {this.state.lastname}!</Navbar.Text>
                        <ButtonGroup className="mr-2">
                        <Link to="/UserPage"><Button className="p-0 border-0" style={{width: "55px", backgroundColor: "#57068C"}}><img src={this.state.avatar} width={50} height={50}/></Button></Link>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2">
                        <Button variant="outline-light" onClick={(e) => { this.logout();}}>Log Out</Button>
                        </ButtonGroup>
                </Navbar.Collapse>}
                {!this.state.username &&
                <Navbar.Collapse className="justify-content-end">
                    <ButtonGroup className="mr-2">
                        <Link to="/login"><Button variant="outline-light">Log In</Button></Link>
                    </ButtonGroup>
                    <ButtonGroup className="mr-2">
                        <Link to="/register"><Button variant="outline-light">Create an Account</Button></Link>
                    </ButtonGroup>
                </Navbar.Collapse>}
            </Navbar>
        );
    }
}

export default withRouter(NavBar);
