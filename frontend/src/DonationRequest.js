import './DonationRequest.css';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar' 

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
				
				<div className="container donation-form shadow-lg">
					<div className="donation-image purple-bg">
						<img src="plant.png" alt="rocket_contact" />
						<h1 className="mt-3">Create Donation Request</h1>
					</div>
					
					<form onSubmit={(e) => { this.submit(); e.preventDefault(); }} className="bg-light rounded border">
						<div className="card-group">
							<div className="col-md-6 border-right">
								<div className="form-group">
									<label className="form-control-label font-weight-bold lead">Sprout Name</label>
									<input type="text" name="name" className="form-control " placeholder="Enter sprout name" onChange={this.handleChange} required />
								</div>
			  
								<div className="form-group">
									<label className="form-control-label font-weight-bold lead">Sprout Category</label>
									<br />
									<select className="form-control" name="category" onChange={this.handleChange}>
										<option selected value="books">Books</option>
										<option value="gas">Gas</option>
										<option value="groceries">Groceries</option>
									</select>
								</div>
			  
								<div className="form-group">
									<label className="form-control-label font-weight-bold lead">Sprout Amount <span className="small">(max: $50)</span></label>
									<input type="number" name="amount" className="form-control " placeholder="Enter amount needed" onChange={this.handleChange} defaultValue="0" min="1" max="50" type="number" />
								</div>
							</div>
							
							<div className="col-md-6">
								<div className="form-group">
									<label className="form-control-label font-weight-bold lead">Upload Sprout Image</label>
									<input type="file"  name="image" accept="image/*" onChange={this.handleUpload}/>
								</div>
			  
								<div className="form-group">
									<label className="form-control-label font-weight-bold lead">Sprout Description <span className="small">(max: 200 characters)</span></label>
									<textarea name="description" className="form-control" placeholder="Enter sprout description" maxLength="200" style={{width: '100%', height: '150px'}} onChange={this.handleChange} required />
								</div>
							</div>
 
						</div>
						
						<div className="card-group mt-3" style={{marginLeft: "30%", width: "80%"}}>
							<div className="col-md-12">
								<div className="form-group">
									<input type="submit" name="btnSubmit" className="btnContact" value="Plant your Sprout" />
								</div>
							</div>
						</div>
					</form>
			
			</div>
		</div>
        );
    }
}

export default DonationRequest;
