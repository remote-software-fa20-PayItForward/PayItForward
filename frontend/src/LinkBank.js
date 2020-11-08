import * as Duo from './Duo-Web-v2';
import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { PlaidLink } from 'react-plaid-link';

class LinkBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            link_token: null,
            public_link_token: null
        }
        this.handlePlaidHandoff = this.handlePlaidHandoff.bind(this);
    }

    componentDidMount() {
        fetch('/obtain-plaid-link-token', {credentials: 'include'}).then((response) => {
            if (!response.ok && response.status == 401) {
                this.setState({isLoading: false, hasAuthenticatedUser: false});
                return;
            }

            response.json().then(body => {
                console.log(body);
                this.setState({hasAuthenticatedUser: true, link_token: body});
            });
            this.setState({isLoading: false});
        });
    }

    handlePlaidHandoff(event) {
        if (event == 'HANDOFF' && this.state.public_link_token != null) {
            // the Plaid Link (bank account login) modal dialog has just closed after sucessfull linkage
            // pass public_link_token to the backend and obtain access_token and Plaid Item for it
            // (the backeng is going to register the newly linked bank account unless it is already stored to the user's bank account DB)
            this.setState({isLoading: true}, () => {
                fetch('link-bank-account', {
                    credentials: 'include',
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({public_link_token: this.state.public_link_token})
                }).then((response) => {
                    this.setState({isLoading: false});
                    
                    if (!response.ok && response.status == 401) {
                        this.setState({hasAuthenticatedUser: false});
                        return;
                    }

                    if (!response.ok && response.status == 409) {
                        response.json().then(body => {
                            if (body.error != null) {
                                alert(body.error);
                            }
                        });
                        return;
                    }

                    if (!response.ok && response.status == 500) {
                        response.json().then(body => {
                            if (body.error != null) {
                                alert(body.error);
                            }
                        });
                        return;
                    }
        
                    response.json().then(body => {
                        if (body.success != null) {
                            alert(body.success);
                        }
                        this.props.history.push('/');
                    });
                });
            });
          
        }
    }

    
    render() {
        let { isLoading, hasAuthenticatedUser, link_token } = this.state;
        return(
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/">Pay it Forward</Navbar.Brand>
                </Navbar>

                {isLoading &&
                    <p>Loading...</p>
                }

                {!isLoading && !hasAuthenticatedUser && 
                    <p>You are not authenticated. Please <Link to="/login">Log In</Link> to allow linking your bank account.</p>
                }
                {!isLoading && hasAuthenticatedUser && link_token != null &&
                    //<PlaidLink token={link_token} onSuccess={(e) => {console.log(e);}}>//
                    <PlaidLink
                        className="CustomButton"
                        style={{ padding: '20px', fontSize: '16px', cursor: 'pointer' }}
                        product={['auth', 'transactions']}
                        token={link_token.link_token}
                        onExit={(e) => {console.log('Plaid Link EXIT:', e)}}
                        onSuccess={(public_token) => {this.setState({public_link_token: public_token})}}
                        onEvent={this.handlePlaidHandoff}
                    >
                        Connect Bank
                    </PlaidLink>
                }
            </div>
        );
    }
}

export default LinkBank;
