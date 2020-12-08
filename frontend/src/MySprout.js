//import './MySprout.css';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import CardDeck from 'react-bootstrap/CardDeck';
import Badge from 'react-bootstrap/Badge';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import CardColumns from 'react-bootstrap/CardColumns';

class MySprout extends Component{

	 constructor(props) {
        super(props);
        this.state = {
            requests: [],
            empty: false
				}
    }

	componentDidMount() {
        fetch('/donation-request/:id').then((response) => {
            response.json().then(body => {
				console.log(body);
				if (body.length > 0) {
					console.log(body);
					this.setState({
						empty: false,
						requests: body
					})
				} else {
					this.setState({
						empty: true,
						requests: []
					})
				}
            });
        });
    }

		cancel(id) {
			fetch(`/donation-request/cancel/${id}`, {
				method: "POST",
			 	headers: {
				'Content-type': 'application/json'
			 	},
			}).then((response) => {
				response.json().then(body => {
					this.setState({
						requests: body
					})
				})
    	})
		}

    render() {
        return(
            <div>
                <NavBar />
                <h1 className="purple-text text-center font-weight-bold mt-5" >My Sprouts</h1>

                { this.state.empty == false ? (
                    <Row className="justify-content-center m-5">
											<CardColumns>
	                        {this.state.requests.reverse().map((request, i) => {
															let donationProgress = (request.amountCollected/request.amount)*100;
															console.log(donationProgress);
															if (donationProgress > 100) {
																	donationProgress = 100;
															}
															donationProgress = donationProgress.toFixed(2);

															return (
	                            <Card className="mt-3 shadow-lg purple-bg" style={{width: '100%'}}>
																<Row className="justify-content-center mt-3">
																	{request.status == "active" ?
																		<h2><Badge variant="success">Active</Badge></h2>
																	: request.status == "completed" ?
																		<h2><Badge variant="secondary">Completed</Badge></h2>
																	: <h2><Badge variant="danger">Canceled</Badge></h2>
																	}
																</Row>

		                            <div className="border mt-3 bg-white" >
		                                <Card.Img variant="top" src={request.image} alt="Card image cap" style={{width: '50%', marginLeft: '25%'}}/>
		                            </div>

		                            <Col md={12}>
		                                <h3 className="my-4 text-center">{request.name}</h3>
		                                <CardGroup className="pl-3 pb-3 text-center">
		                                    <Card className="mr-3 text-dark rounded text-left">
		                                        <Card.Body>
		                                            <p className="lead font-weight-bold purple-text">Sprout Description: </p>
		                                            <p className=""> {request.description} </p>

		                                            <h4 className="float-left"><Badge variant="primary">#{request.category}</Badge></h4>

		                                        </Card.Body>
		                                    </Card>
		                                </CardGroup>
		                            </Col>

																<Col md={12}>
																	<CardGroup className="pl-3 pb-1 text-center">
																		<Card className="mr-3 text-dark rounded">
																			<Card.Body>
																				<p className="lead font-weight-bold display-4 purple-text"> ${request.amount.toFixed(2)} </p>
																				<p className="font-weight-bold"> requested sprout amount </p>
																			</Card.Body>
																		</Card>
																	</CardGroup>
																</Col>

																<Col md={12}>
																	<CardGroup className="pl-3 pb-1 text-center">
																		<Card className="mr-3 text-dark rounded">
																			<Card.Body>
																				<p className="lead font-weight-bold display-4 purple-text"> {request.subscribers.length} </p>
																				<p className="font-weight-bold"> planters growing your sprout </p>
																			</Card.Body>
																		</Card>
																	</CardGroup>
																	</Col>

																	<Col md={12}>
																		<CardGroup className="pl-3 pb-1 text-center">
																		<Card className="mr-3 text-dark rounded">
																			<Card.Body>
																				<div class="progress">
																						<div class="progress-bar" role="progressbar" style={{width: `${donationProgress}%`}} aria-valuenow={donationProgress} aria-valuemin="0" aria-valuemax="100"></div>
																				</div>
																				<p className="lead font-weight-bold display-4 purple-text"> ${request.amountCollected.toFixed(2)} </p>
																				<p className="font-weight-bold"> current sprout amount </p>
																			</Card.Body>
																		</Card>
																		</CardGroup>
																</Col>

																{request.status == "active" ?
			                            <div className="text-center">
			                                <Link to="#"><Button className="font-weight-bold px-3 mb-3" variant="danger" onClick={(e) => {this.cancel(this.state.requests[i]._id)}}><h6>Cancel Sprout</h6></Button></Link>
			                                <br />
			                            </div>
																: <div classname="m-5"></div>
																}
	                        		</Card>
	                        )})}
											</CardColumns>
                    </Row>
                ) : (
                    <Row className="justify-content-center">
                        <h2 className="purple-text">No current sprouts available</h2>
                    </Row>
                )}

            </div>
        )
    }
}

export default MySprout;
