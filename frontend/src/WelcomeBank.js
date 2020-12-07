import React, { Component } from "react";
import NavBar from './Navbar'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { PlaidLink } from 'react-plaid-link';

class WelcomeBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            link_token: null,
            public_link_token: null,
            bankItems: null,
            bankAccounts: null
        }
        this.handlePlaidHandoff = this.handlePlaidHandoff.bind(this);
        this.obtainPlaidLinkToken = this.obtainPlaidLinkToken.bind(this);
    }

    componentDidMount() {
        this.obtainPlaidLinkToken();
    }

    obtainPlaidLinkToken() {
        fetch('/banks/obtain-plaid-link-token', {credentials: 'include'}).then((response) => {
            if (!response.ok && response.status == 401) {
                this.props.history.push('/register');
                return;
            }

            response.json().then(body => {
                console.log(body);
                this.setState({link_token: body, isLoading: false});
            });
        });
    }

    handlePlaidHandoff(event) {
        if (event == 'HANDOFF' && this.state.public_link_token != null) {
            fetch('/banks/link', {
                credentials: 'include',
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({public_link_token: this.state.public_link_token})
            }).then((response) => {
                if (!response.ok && response.status == 401) {
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
                    this.props.history.push('/welcome/bank/accounts');
                });
            });
        }
    }

    render() {
        return(
            <div>
                <NavBar />
                <h1>Authorize Round-Ups</h1>
                <p>Choose the bank or financial institution that issued your card and log in with your credentials to grant authorization. We use the Plaid to securely do this.</p>
                {!this.state.isLoading &&
                <PlaidLink
                    className="btn btn-primary"
                    style={{ padding: '', border: '', background: '' }}
                    product={['auth', 'transactions']}
                    token={this.state.link_token.link_token}
                    onExit={(e) => {console.log('Plaid Link EXIT:', e)}}
                    onSuccess={(public_token) => {this.setState({public_link_token: public_token})}}
                    onEvent={this.handlePlaidHandoff}
                >
                    Connect Bank
                </PlaidLink>
                }<Link to="/home"><Button variant="link">Skip</Button></Link>
            </div>
        )
    }
}

export default WelcomeBank;
