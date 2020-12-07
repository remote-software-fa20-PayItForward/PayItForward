import React, { Component } from "react";
import NavBar from './Navbar'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
                <Row className="justify-content-center mt-5">
                  <Col md={8}>
                  	<CardGroup className="pl-3 pb-3 text-center">
                  		<Card className="mr-3 text-dark rounded text-left shadow p-3">
                  			<Card.Body>
                          <h1 className="purple-text">You are all set up!</h1>
                          <hr />
                          {this.state.role == "donor" &&
                          <p className="lead">Your bank account and donation card have been successfully linked. You may now choose a sprout to grow.</p>
                          }
                          {this.state.role == "donee" &&
                          <p className="lead">You have been successfully onboarded. You may now plant a sprout.</p>
                          }
                          <div className="text-center mt-3">
                            {this.state.role == "donor" &&<Link to="/donation-requests"><Button>Choose a Sprout</Button></Link>}
                            {this.state.role == "donee" &&<Link to="/donation-request"><Button>Plant a Sprout</Button></Link>}
                            <Link to="/home"><Button variant="link">Skip</Button></Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </CardGroup>
                  </Col>
                </Row>
            </div>

        )
    }
}

export default WelcomeDonationRequest;
