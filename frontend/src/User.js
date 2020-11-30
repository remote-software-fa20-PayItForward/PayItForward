import './UserPage.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import React, { Component } from "react";
import NavBar from './Navbar'
import ProfilePic from './ProfilePic';
import { findAllByTestId } from '@testing-library/react';

class User extends Component {
	 constructor(props) {
        super(props); 
        this.state = {
            username: "",
            first: "",
            last: "",
            bio: "",
            avatar: "/profile.jpg",
            vusername: "",
            vfirst: "",
            vlast: "",
            vbio: "",
            vavatar: "/profile.jpg"
        }
    }

	componentDidMount() {
		console.log(this.props);
        Promise.all([
            fetch('/user', {credentials: 'include'}),
            fetch('/user/' + this.props.match.params.id)
         ]).then(allResponses => {
             allResponses[0].json().then(body => {
                 if (!body.username) {
                     this.props.history.push('/login');
                 }
                 this.setState({
                     username: body.username,
                     first: body.first,
                     last: body.last,
                     bio: body.bio,
                     avatar: body.avatar ? body.avatar : "/profile.jpg",
                 })
             })
             allResponses[1].json().then(body => {
             	// if(!body.username) {
             	// 	this.props.history.push('/');
             	// } 
             	this.setState({
             		vusername: body.username,
             		vfirst: body.first,
             		vlast: body.last,
             		vbio: body.bio,
             		vavatar: body.avatar ? body.avatar : "/profile.jpg",
             	})
             })
         })
    }

    render() {
    	return(
    		<div>
    			<NavBar/>

				<div className="py-4">
                	<h3 className="mb-3 purple-text font-weight-bold">{this.state.vfirst} {this.state.vlast}</h3>
						<Row>
                                        
                        	<Col md={6} className="border mr-5 pt-3 rounded">
								<h5>About</h5>
                           	 	<hr />
                            	<p className="text-break">
                                	{this.state.vbio && 
                                	this.state.vbio}
                                		{!this.state.vbio &&
                                     	"No bio here yet!"}
                            	</p>
                    		</Col>
                    	</Row>
    			</div>
			</div>
    	)
    }
}

export default User;