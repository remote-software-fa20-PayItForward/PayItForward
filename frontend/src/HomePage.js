import './HomePage.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'

class HomePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAuthenticatedUser: false,
            bankItems: null
        }
        this.triggerPlaidLinkOpen = this.triggerPlaidLinkOpen.bind(this);
    }

    triggerPlaidLinkOpen() {
        this.setState({isLoading: true}, () => {
            fetch('/obtain-plaid-link-token', {credentials: 'include'}).then((response) => {
                if (!response.ok && response.status == 401) {
                    this.setState({hasAuthenticatedUser: false});
                    return;
                }

                response.json().then(body => {
                    console.log(body);
                });
                this.setState({isLoading: false});
            });
        });
    }

    componentDidMount() {
        fetch('/linked-banks', {credentials: 'include'}).then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    this.setState({bankItems: body.bankItems, hasAuthenticatedUser: true});
                });
            } else if (response.status == 401) {
                this.setState({hasAuthenticatedUser: false});
            }
            this.setState({isLoading: false});
        });
    }

    render() {
        let { isLoading, bankItems, hasAuthenticatedUser } = this.state;
        return(
        
            <div>
                {/*
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Pay it Forward</Navbar.Brand>
                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item" id="logout">
                        <a className="nav-link" href="#">Log Out</a>
                    </li>
                </ul>
            </div>
            
        </Navbar>
                */}
            <NavBar />
            <br />
                <div className="container">
                    <h1>Welcome</h1>
                    {isLoading &&
                        <p>Loading...</p>
                    }
                    
                    {!isLoading && !hasAuthenticatedUser && 
                        <p>Please <Link to="/login">log in</Link> to start managing your bank accounts.</p>
                    }
                    {!isLoading && hasAuthenticatedUser &&
                        <div>
                            <h2>Connected Banks</h2>
                            <ul>
                            {bankItems.map((bankItem) => <li>{bankItem.bankName} <Link to={`/banks/${bankItem.bankId}/accounts`}>View Accounts</Link></li>)}
                            </ul>
                            <Link to="/link-bank-account" onClick={this.triggerPlaidLinkOpen}>Link New Bank</Link>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default HomePage;
