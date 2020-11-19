import './DonationRequest.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar' 

class DonationRequest extends Component{
    
    render() {

        return(
        
            <div>
                <NavBar />
				
				<div className="container donation-form shadow-lg">
					<div className="donation-image purple-bg">
						<img src="plant.png" alt="rocket_contact" />
						<h1 className="mt-3">Create Donation Request</h1>
					</div>
					
					<form method="POST" className="bg-light rounded border">
						<div className="card-group">
							<div className="col-md-6 border-right">
								<div className="form-group">
									<label className="form-control-label font-weight-bold lead">Sprout Name</label>
									<input type="text" name="txtName" className="form-control " placeholder="Enter sprout name" />
								</div>
			  
								<div className="form-group">
									<label className="form-control-label font-weight-bold lead">Sprout Category</label>
									<br />
									<select className="form-control ">
										<option selected value="books">Books</option>
										<option value="gas">Gas</option>
										<option value="groceries">Groceries</option>
									</select>
								</div>
			  
								<div className="form-group">
									<label className="form-control-label font-weight-bold lead">Sprout Amount <span className="small">(max: $50)</span></label>
									<input type="number" name="txtName" className="form-control " placeholder="Enter amount needed" />
								</div>
							</div>
							
							<div className="col-md-6">
								<div className="form-group">
									<label className="form-control-label font-weight-bold lead">Upload Sprout Image</label>
									<p>Upload image code here</p>
								</div>
			  
								<div className="form-group">
									<label className="form-control-label font-weight-bold lead">Sprout Description <span className="small">(max: 200 characters)</span></label>
									<textarea name="txtMsg" className="form-control" placeholder="Enter sprout description" maxLength="200" style={{width: '100%', height: '150px'}} defaultValue={""} />
								</div>
							</div>
 
						</div>
						
						<div className="card-group mt-3" style={{marginLeft: "30%", width: "80%"}}>
							<div className="col-md-12">
								<div className="form-group">
									<input type="submit" name="btnSubmit" className="btnContact" defaultValue="Send Message" />
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
