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
    
    render() {
        return(
            <div>
                <NavBar />
                <h1 className="purple-text text-center font-weight-bold mt-5" >My Sprouts</h1>
				
                { this.state.empty == false ? (
                    <Row className="justify-content-center m-5">
                        {this.state.requests.map((request, i) => (
							<div className="col-6">
                            <Card className="mt-3 shadow-lg purple-bg" style={{width: '100%'}}>
                            <div className="border mt-5 bg-white" >
                                <Card.Img variant="top" src={request.image} alt="Card image cap" style={{width: '50%', marginLeft: '25%'}}/>
                            </div>
                            
                            <Col md={12}>
                                <h3 className="my-4 text-center">{request.name}</h3>
                                <CardGroup className="pl-3 pb-3 text-center">
                                    <Card className="mr-3 text-dark rounded text-left">
                                        <Card.Body>
                                            <p className="lead font-weight-bold purple-text">Sprout Description: </p>
                                            <p className=""> {request.description} </p>
                                            <h4><Badge variant="primary">#{request.category}</Badge></h4> 
                                        </Card.Body>
                                    </Card>
                                </CardGroup>
                            </Col>
						  
						<Col md={12}>
							<CardGroup className="pl-3 pb-3 text-center">
								<Card className="mr-3 text-dark rounded">
									<Card.Body>
										<p className="lead font-weight-bold display-4 purple-text"> ${request.amount} </p>
										<p className="font-weight-bold"> requested sprout amount </p>
									</Card.Body>
								</Card>
								
								<Card className="mr-3 text-dark rounded">
									<Card.Body>
										<p className="lead font-weight-bold display-4 purple-text"> 8 </p>
										<p className="font-weight-bold"> planters growing your sprout </p>
									</Card.Body>
								</Card>
								
								<Card className="mr-3 text-dark rounded">
									<Card.Body>
										<p className="lead font-weight-bold display-4 purple-text"> $35 </p>
										<p className="font-weight-bold"> current sprout amount </p>
									</Card.Body>
								</Card>
							</CardGroup>
							
						</Col>
                            
                            <div className="text-center">
                                <Link to="#"><Button className="font-weight-bold px-3 mb-3" variant="warning"><h6>Edit My Sprout</h6></Button></Link>
                                <br />
                            </div>
                        </Card>
						</div>
                        ))}
						
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
