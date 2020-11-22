import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class Requests extends Component{
	
    constructor(props) {
       super(props); 
       this.state = {
           requests: []
       }
    }

    componentDidMount() {
        fetch('/user').then((response) => {
            response.json().then(body => {
                if (!body.username) {
                    this.props.history.push('/login');
                }
            })
        })
        fetch('/donation-request/all').then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((body) => {
            this.setState({requests: body});
        })
    }

    render() {
        return(
            <div>
                <NavBar />
                <h1 className="purple-text text-center font-weight-bold mt-5" >All Sprouts</h1>
                <Row className="justify-content-center">
                    <Card className="my-5  shadow-lg" style={{width: '50%'}}>
                        <ListGroup>
                            {this.state.requests.map((request, i) => (
                                <Link to={"/sprout/" + request._id}><ListGroup.Item>{request.name}</ListGroup.Item></Link>
                            ))}
                        </ListGroup>
                    </Card>
                </Row>
            </div>
        )
    }

}

export default Requests;