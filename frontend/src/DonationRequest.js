import './DonationRequest.css';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar' 
import Container from 'react-bootstrap/Container';
import CardGroup from 'react-bootstrap/CardGroup';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'

class DonationRequest extends Component{

	constructor(props) {
        super(props);
		this.submit = this.submit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
		this.state = {
			name: '',
			category: 'books',
			amount: 0,
			image: null,
			description: ''
		}
	}

	componentDidMount() {
		fetch('/user').then((response) => {
			response.json().then((body) => {
				if (!body.username) {
					this.props.history.push('/login');
				} else if (!body.hasStripeAccount) {
					this.props.history.push('/stripe-onboarding')
				} else {
					fetch("/stripe/account").then(response => response.json()).then(body => {
						if (!body.details_submitted || !body.charges_enabled) {
						  	this.props.history.push('/stripe-onboarding');
						}
					})
				}
			})
		})
	}

	handleChange(e) {
		this.setState({[e.target.name]: e.target.value });
	}

	handleUpload(e) {
		this.setState({image: e.target.files[0]})
	}

	submit() {
		const formData = new FormData();
		formData.append("name", this.state.name);
		formData.append("category", this.state.category);
		formData.append("amount", this.state.amount);
		formData.append("description", this.state.description);
		if (this.state.image) {
			formData.append( 
				"image", 
				this.state.image, 
				this.state.image.name 
			);
		}
		fetch('/donation-request', {
            method: "POST",
        	body: formData
        })
		.then((response) => {
             if (response.ok) {
                this.props.history.push('/my-sprout');
            } else {
                response.json().then(body => {
                    console.log(body.error);
                })
            }
        })
	}
    
    render() {

        return(
        
            <div>
                <NavBar />
				
				<Container className="donation-form shadow-lg">
					<div className="donation-image purple-bg">
						<img src="plant.png" alt="rocket_contact" />
						<h1 className="mt-3">Create Donation Request</h1>
					</div>
					
					<Form onSubmit={(e) => { this.submit(); e.preventDefault(); }} className="bg-light rounded border">
						<CardGroup>
							<Col md={6} className="border-right">
								<Form.Group>
									<Form.Label className="font-weight-bold lead" for="name">Sprout Name</Form.Label>
									<Form.Control type="text" name="name" placeholder="Enter sprout name" onChange={this.handleChange} required />
								</Form.Group>
			  
								<Form.Group>
									<Form.Label className="font-weight-bold lead" for="category">Sprout Category</Form.Label>
									<br />
									<Form.Control as="select" name="category" onChange={this.handleChange}>
										<option selected value="books">Books</option>
										<option value="gas">Gas</option>
										<option value="groceries">Groceries</option>
									</Form.Control>
								</Form.Group>
			  
								<Form.Group>
									<Form.Label className="font-weight-bold lead" for="amount">Sprout Amount <span className="small">(max: $50)</span></Form.Label>
									<Form.Control type="number" name="amount" placeholder="Enter amount needed" onChange={this.handleChange} defaultValue="0" min="1" max="50" type="number" />
								</Form.Group>
							</Col>
							
							<Col md={6}>
								<Form.Group>
									<Form.Label className="font-weight-bold lead" for="image">Upload Sprout Image</Form.Label>
									<input type="file"  name="image" accept="image/*" onChange={this.handleUpload} required/>
								</Form.Group>
			  
								<Form.Group>
									<Form.Label className="font-weight-bold lead" for="description">Sprout Description <span className="small">(max: 200 characters)</span></Form.Label>
									<Form.Control as="textarea" name="description" className="form-control" placeholder="Enter sprout description" maxLength="200" style={{width: '100%', height: '150px'}} onChange={this.handleChange} required />
								</Form.Group>
							</Col>
 
						</CardGroup>
						
						<CardGroup className="mt-3" style={{marginLeft: "30%", width: "80%"}}>
							<Col md={12}>
								<Form.Group>
									<input type="submit" name="btnSubmit" className="btnContact" value="Plant your Sprout" />
								</Form.Group>
							</Col>
						</CardGroup>
					</Form>
			
				</Container>
			</div>
        );
    }
}

export default DonationRequest;
