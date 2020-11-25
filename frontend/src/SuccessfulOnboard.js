import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
class SuccessfulOnboard extends Component {

    constructor(props) {
        super(props);
        this.flash = true;
    }

    componentDidMount(){
        fetch('/user').then((response) => {
			response.json().then((body) => {
				if (!body.username) {
					this.props.history.push('/login');
				}
			})
		})
    }

    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand onClick={(e) => {this.props.history.push('/')}} href="javascript:void(0)">Pay it Forward</Navbar.Brand>
                </Navbar>
               <h1>Successfully Onboarded!</h1>
               <Link to="/">Go to Homepage</Link>
            </div>
        );
    }
}
export default SuccessfulOnboard;