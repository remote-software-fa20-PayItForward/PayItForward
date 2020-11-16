import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
class SuccessfulPayment extends Component {

    constructor(props) {
        super(props);
        this.flash = true;
        this.state = {
        }
    }


    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand onClick={(e) => {this.props.history.push('/')}} href="javascript:void(0)">Pay it Forward</Navbar.Brand>
                </Navbar>
               <h1>Thank you for donating!</h1>
               <Link to="/">Go to Homepage</Link>
            </div>
        );
    }
}
export default SuccessfulPayment;