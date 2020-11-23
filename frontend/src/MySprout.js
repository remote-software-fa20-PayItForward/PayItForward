//import './MySprout.css';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CardGroup from 'react-bootstrap/CardGroup';
import Badge from 'react-bootstrap/Badge';

class MySprout extends Component{
	
	 constructor(props) {
        super(props); 
        this.state = {
			name: "",
			image: "",
			description: "",
			category: "",
			amount: "",
        }
    }

	componentDidMount() {
        fetch('/donation-request').then((response) => {
            response.json().then(body => {
				console.log(body);
				if (body) {
					this.setState({
						name: body.name,
						image: body.image ? body.image: "/sprout.png",
						description: body.description,
						category: body.category,
						amount: body.amount
					})
				} else {
					this.props.history.push('/donation-request');
				}
            });
        }); 
    }
    
    render() {

        return(
        
            <div>
                <NavBar />
				

				
				<h1 className="purple-text text-center font-weight-bold mt-5" >My Sprout</h1>
				
				<Row className="justify-content-center">
					<Card className="my-5  shadow-lg purple-bg" style={{width: '50%'}}>
						<div className="border mt-5 bg-white" >
							<Card.Img variant="top" src={this.state.image} alt="Card image cap" style={{width: '50%', marginLeft: '25%'}}/>
						</div>
						
						<Col md={12}>
							<h3 className="my-4 text-center">{this.state.name}</h3>
							<CardGroup className="pl-3 pb-3 text-center">
								<Card className="mr-3 text-dark rounded text-left">
									<Card.Body>
										<p className="lead font-weight-bold purple-text">Sprout Description: </p>
										<p className=""> {this.state.description} </p>
										<h4><Badge variant="primary">#{this.state.category}</Badge></h4> 
									</Card.Body>
								</Card>
							</CardGroup>
						</Col>
						  
						<Col md={12}>
							<CardGroup className="pl-3 pb-3 text-center">
								<Card className="mr-3 text-dark rounded">
									<Card.Body>
										<p className="lead font-weight-bold display-4 purple-text"> ${this.state.amount} </p>
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
													
							<div className="text-center">
								<Link to="/my-sprout"><Button className="font-weight-bold px-3 mb-3" variant="warning"><h6>Edit My Sprout</h6></Button></Link>
								<br />
							</div>
							
						</Col>
					</Card>
				</Row>
				
			</div>
			
        );
    }
}

export default MySprout;
