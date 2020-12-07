import React, { Component } from "react";
import NavBar from './Navbar'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link: ""
        }
    }
    componentDidMount() {
        fetch('/user').then((response) => {
            if (response.ok) {
                response.json().then(body => {
                    if (!body.username) {
                        this.props.history.push('/register');
                    } else {
                        switch (body.role) {
                            case "donor":
                                this.setState({link: "/welcome/bank"})
                                break;
                            case "donee":
                                this.setState({link: "/welcome/account"})
                                break;
                        }
                    }
                });
            }
        });
    }

    render() {
        return(
            <div>
                <NavBar />
                <h1>Welcome to Pay it Forward!</h1>
                <p>You will be guided through the steps to set up your Pay It Forward account</p>
                <Link to={this.state.link}><Button>Next</Button></Link><Link to="/home"><Button variant="link">Skip</Button></Link>
            </div>
        )
    }
}

export default Welcome;
