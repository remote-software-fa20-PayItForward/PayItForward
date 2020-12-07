import React, { Component } from "react";
import NavBar from './Navbar'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import WelcomeCardForm from './WelcomeCardForm';
const promise = loadStripe("pk_test_51HhIVhKJyyCVsqcoeOjgBymqqNJRf5R1tt8U5D0Ksu0AT3lyHSrkN55DHPjAm3rN2h1xHPtq1qVwUSJFbS8RF3tU00YKHhsdI9");

class WelcomeCard extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        fetch('/user').then((response) => {
            response.json().then((body) => {
                if (!body.username) {
                    this.props.history.push('/login');
                }
            })
        })
      }

    render() {
        return(
            <div>
                <NavBar />
                <h1>Attach Card</h1>
                <p>Let's connect the card you would like your donations to be sent from. You will be able to connect to multiple accounts later, but all donations will process from the account you link here.</p>
                <Elements stripe={promise}><WelcomeCardForm /></Elements>  
                <Link to="/home"><Button variant="link">Skip</Button></Link>
            </div>
        )
    }
}

export default WelcomeCard;


