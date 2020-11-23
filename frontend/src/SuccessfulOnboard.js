import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
class SuccessfulOnboard extends Component {

    constructor(props) {
        super(props);
        this.flash = true;
        this.state = {
        }
    }

    componentDidMount(){
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/";
        script.async = true;
        document.body.appendChild(script);
        const script1 = document.createElement("script");
        script1.src = "/connectStripe.js";
        script1.async = true;
        //script1.attributes.appendChild("defer");
        document.body.appendChild(script1);

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