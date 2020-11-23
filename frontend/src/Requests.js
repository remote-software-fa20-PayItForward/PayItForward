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

class Requests extends Component{
	
    constructor(props) {
        super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			category: 'books',
            requests: [],
            empty: false
		}
        /*
       super(props); 
       this.state = {
           requests: []
       }
       */
    }

    componentDidMount() {
        fetch('/user').then((response) => {
            response.json().then(body => {
                if (!body.username) {
                    this.props.history.push('/login');
                }
            })
        })
        /*
        fetch('/donation-request/all').then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((body) => {
            this.setState({requests: body});
        })
        */
    }
    
    handleChange(e) {
		this.setState({[e.target.name]: e.target.value });
	}
    
    select() {
		fetch(`/donation-request/category/${this.state.category}`).then((response) => {
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
        })
	}

    render() {
        return(
            <div>
                <NavBar />
                <h1 className="purple-text text-center font-weight-bold mt-5" >Grow A Sprout</h1>
                 <Row className="justify-content-center">
                    <Form onSubmit={(e) => { this.select(); e.preventDefault(); }} className="bg-light rounded border my-5  shadow-lg p-3" style={{width: '50%'}}> 
                        <Form.Group>
                            <Form.Label className="font-weight-bold lead" for="category">Select Sprout Category</Form.Label>
                            <Form.Control as="select" name="category" onChange={this.handleChange}>
                                <option selected value="books">Books</option>
                                <option value="gas">Gas</option>
                                <option value="groceries">Groceries</option>
                            </Form.Control>
                        </Form.Group>
                    
                        <Form.Group className="float-right">
                            <input type="submit" name="btnSubmit" className="btnContact purple-bg rounded border-0 p-2" value="View Sprouts" />
                        </Form.Group>
                    </Form>
                </Row>
                
                { this.state.empty == false ? (
                    <CardColumns className="justify-content-center m-5">
                        {this.state.requests.map((request, i) => (
                            <Card className="mt-3 shadow-lg purple-bg" style={{width: '100%'}}>
                            <div className="border mt-5 bg-white" >
                                <Card.Img variant="top" src={request.image} alt="Card image cap" style={{width: '50%', marginLeft: '25%'}}/>
                            </div>
                            
                            <Col md={12}>
                                <h3 className="my-4 text-center">{request.name}</h3>
                                <CardGroup className="pl-3 pb-1 text-center">
                                    <Card className="mr-3 text-dark rounded text-center">
                                        <Card.Body>
                                             <span> <img src={request.user.avatar} className=" rounded-circle img-fluid " width={35} height={35} /> </span>
                                            sprout by <span className="font-weight-bold purple-text"> {request.user.first} {request.user.last} </span>
                                        </Card.Body>
                                    </Card>
                                </CardGroup>
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
                                </CardGroup>
                            </Col>
                            
                            <div className="text-center">
                                <Link to="/donate"><Button className="font-weight-bold px-3 mb-3" variant="success"><h6>Grow Sprout</h6></Button></Link>
                                <br />
                            </div>
                        </Card>
                        ))}
                        
                        {/*
                        <Card className="my-5  shadow-lg" style={{width: '50%'}}>
                            <ListGroup>
                                {this.state.requests.map((request, i) => (
                                    <Link to={"/sprout/" + request._id}><ListGroup.Item>{request.name}</ListGroup.Item></Link>
                                ))}
                            </ListGroup>
                        </Card>
                        */}
                    </CardColumns>
                ) : (
                    <Row className="justify-content-center">
                        <h2 className="purple-text">No current sprouts available</h2>
                    </Row>
                )}
                
            </div>
        )
    }

}

export default Requests;