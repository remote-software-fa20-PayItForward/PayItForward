import React, { Component } from "react";
import NavBar from './Navbar'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';

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

                <Row className="justify-content-center mt-5">
                	<CardGroup className="pl-3 pb-3 text-center">
                		<Card className="mr-3 text-dark rounded text-left shadow p-3">
                			<Card.Body>
                        <h1 className="purple-text">Welcome to Pay It Forward!</h1>
                        <hr />
                        <p className="lead">You will be guided through the steps to set up your Pay It Forward account.</p>
                        <div className="text-center">
                          <Link to={this.state.link}><Button>Next</Button></Link><Link to="/home"><Button variant="link">Skip</Button></Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </CardGroup>
                </Row>
            </div>
        )
    }
}

export default Welcome;
