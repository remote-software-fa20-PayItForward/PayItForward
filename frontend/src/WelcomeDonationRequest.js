import React, { Component } from "react";
import NavBar from './Navbar'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

class WelcomeDonationRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: ""
        }
    }

    componentDidMount() {
        fetch('/user').then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    if (!body.username) {
                        this.props.history.push('/register');
                    } else {
                        this.setState({role: body.role})
                    }
                });
            }
        });
    }

    render() {
        return(
            <div>
                <NavBar />
                <h1>You are all set up!</h1>
                {this.state.role == "donor" &&
                <p>Your bank account and donation card have been successfully linked. You may now choose a sprout to grow.</p>
                }
                {this.state.role == "donee" &&
                <p>You have been successfully onboarded. You may now plant a sprout.</p>
                }
                {this.state.role == "donor" &&<Link to="/donation-requests"><Button>Choose a Sprout</Button></Link>}
                {this.state.role == "donee" &&<Link to="/donation-request"><Button>Plant a Sprout</Button></Link>}
                <Link to="/home"><Button variant="link">Skip</Button></Link>
            </div>
            
        )
    }
}

export default WelcomeDonationRequest;
