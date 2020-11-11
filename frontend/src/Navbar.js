import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

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
                    lastname: body.last
                })
            });
        }); 
    }

    logout() {
        fetch('/logout',{credentials: 'include'}).then((response) => {
            this.props.history.push('/login');
        });
    }

    render() {
        return(
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand onClick={(e) => {this.props.history.push('/')}} href="javascript:void(0)">Pay it Forward</Navbar.Brand>
                {this.state.username &&
                <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>Welcome, {this.state.firstname} {this.state.lastname}</Navbar.Text>
                        <Link to="/UserPage"><Button variant="outline-light">My Profile</Button></Link>
                        <Button variant="outline-light" onClick={(e) => { this.logout();}}>Log Out</Button>
                </Navbar.Collapse>}
                {!this.state.username &&
                <Navbar.Collapse className="justify-content-end">
                    <ButtonGroup>
                        <Link to="/login"><Button variant="outline-light">Log In</Button></Link>
                        <Link to="/register"><Button variant="outline-light">Create an Account</Button></Link>
                    </ButtonGroup>
                </Navbar.Collapse>}
            </Navbar>
        );
    }
}

export default withRouter(NavBar);