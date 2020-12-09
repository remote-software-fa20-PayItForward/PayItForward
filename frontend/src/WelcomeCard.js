import React, { Component } from "react";
import NavBar from './Navbar'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import WelcomeCardForm from './WelcomeCardForm';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const promise = loadStripe("pk_test_51HhIVhKJyyCVsqcoeOjgBymqqNJRf5R1tt8U5D0Ksu0AT3lyHSrkN55DHPjAm3rN2h1xHPtq1qVwUSJFbS8RF3tU00YKHhsdI9");

class WelcomeCard extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        fetch('/user').then((response) => {
            response.json().then((body) => {
                if (!body.username) {
                    this.props.history.push('/register');
                }
            })
        })
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
                        <h1 className="purple-text">Connect A Card</h1>
                        <hr />
                        <p className="lead">Let's connect the card you would like your donations to be sent from. You will be able to connect to multiple accounts later, but all donations will process from the account you link here.</p>
                        <Elements stripe={promise}><WelcomeCardForm /></Elements>
                        <div className="text-center mt-3">
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

export default WelcomeCard;
