import './MFA.css'
import * as Duo from './Duo-Web-v2';
import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

class MFA extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        if (!this.props.location.state) {
            this.props.history.push('/login');
        } else {
            Duo.init({
                'host': 'api-42b012a0.duosecurity.com',
                'sig_request': this.props.location.state.sig_response,
                'submit_callback': this.submit
            })
        }
    }

    submit(form) {
        console.log("mfa.submit");
        fetch('/mfaverify', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({sig_response: form.elements.sig_response.value})
        })
        .then((response) => {
            console.log(response);
            if(response.ok) {
                this.props.history.push('/');
            } else {
                response.json().then(body => {
                    //this.setState({errorMsg: body.error})
                })
            }
        })
        
    }

    render() {
        return(
            <div>
                <Navbar variant="dark" className="navbar-custom">
                    <Navbar.Brand href="/">Pay it Forward</Navbar.Brand>
                </Navbar>

                <div className="homepage">
                    <div className="form">
                        <iframe id="duo_iframe"></iframe>
                    </div>
                </div>
            </div>
        );
    }
}

export default MFA;