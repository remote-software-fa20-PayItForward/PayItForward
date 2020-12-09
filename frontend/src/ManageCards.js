
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { PlaidLink } from 'react-plaid-link';
import NavBar from './Navbar'
import Button from 'react-bootstrap/Button';

class ManageCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            paymentMethods: [],
            customer: {}
        }
        this.setDefault = this.setDefault.bind(this);
    }

    componentDidMount() {
        fetch('stripe/customer').then((response) => {
            response.json().then(body => {
                console.log(body);
                this.setState({customer: body});
            });
        });
        fetch('/stripe/paymentmethods').then((response) => {
            if (!response.ok && response.status == 401) {
                this.props.history.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
                return;
            }
            response.json().then(body => {
                console.log(body);
                this.setState({isLoading: false, paymentMethods: body.data});
            });
        })
    }

    setDefault(id) {
        fetch('stripe/customer', {
    		method: "POST",
    		headers: {
    		    'Content-type': 'application/json'
    		},
            body: JSON.stringify({invoice_settings: {default_payment_method: id}})
            }).then((response) => {
            response.json().then(body => {
                console.log(body);
                this.setState({customer: body});
            });
        });
    }

    render() {
        return (
            <div>
                <NavBar />
                <br />
                {this.state.isLoading &&
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }
                <div className="container">
                    <div className="row">
                        <div className="col-3">
                            <h2>Donation Cards</h2>
                        </div>
                        <div className="col-3">
                            <Button onClick={() => {this.props.history.push('/add-card')}}>
                                Connect New Card
                            </Button>
                        </div>
                    </div>
                    <div className="row">
                        <table>
                            <tr>
                                <th>Brand</th>
                                <th>Type</th>
                                <th>Number</th>
                                <th>Expiration Date</th>
                                <th>Default</th>
                            </tr>
                            {this.state.paymentMethods.map(paymentMethod => (
                                <tr>
                                    <td>{paymentMethod.card.brand}</td>
                                    <td>{paymentMethod.card.funding}</td>
                                    <td>************{paymentMethod.card.last4}</td>
                                    <td>{paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}</td>
                                    <td>
                                        {!(this.state.customer.invoice_settings.default_payment_method == paymentMethod.id) &&
                                            <input type="button" value="Set as Default" onClick={() => {this.setDefault(paymentMethod.id)}}/>
                                        }
                                        {(this.state.customer.invoice_settings.default_payment_method == paymentMethod.id) &&
                                            <input type="button" value="Default" disabled />
                                        }
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default ManageCards;