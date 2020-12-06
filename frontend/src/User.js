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
    	return (

    		<div>
        		<NavBar />

                <Container className="pt-5">
                    <Row className="my-2">
                        <Col lg={8} className="order-lg-2">

                            <Tabs defaultActiveKey="profile" transition={false} id="noanim-tab-example">
                                <Tab eventKey="profile" title="Profile">
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

                                            <Col className="border pt-3 rounded">
                                                <h5> Achievements </h5>
                                                <hr />
                                                <h5><Badge variant="success ">Top 5% donor</Badge></h5>
                                                <h5><Badge variant="primary">Top 10% donor</Badge></h5>
                                                <h5><Badge variant="dark">Top 20% donor</Badge></h5>
                                            </Col>

                                            <Col md={12} className="mt-4 border rounded purple-bg">

                                                <h5 className="mt-3 text-center"><span className="fa fa-clock-o ion-clock float-right" />{this.state.vfirst}'s Latest Sprout Stats</h5>
                                                <hr />
                                                <CardGroup className="pl-3 pb-3 text-center">
                                                    <Card className="mr-3 text-dark rounded">
                                                        <Card.Body>
                                                            <p className="lead font-weight-bold display-4 purple-text">${this.state.amount} </p>
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
                                                    <Link to="/my-sprout"><Button className="font-weight-bold px-3 mb-3" variant="outline-light"><h6>View All Sprouts</h6></Button></Link>
                                                    <br />
                                                </div>

                                            </Col>
                                        </Row>
                                    </div>
                                </Tab>
                            </Tabs>
                        </Col>

                        <Col lg={4} className="order-lg-1 text-center">
                            <img src={this.state.vavatar} className="mx-auto img-fluid img-circle d-block border" />
                            <br />
                            
                        </Col>
                    </Row>
                </Container>
            </div>
    	);
    }
}

export default User;