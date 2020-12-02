import React, { Component } from "react";
import NavBar from './Navbar'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentCollection from "./PaymentCollection.js";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';


const promise = loadStripe("pk_test_51HhIVhKJyyCVsqcoeOjgBymqqNJRf5R1tt8U5D0Ksu0AT3lyHSrkN55DHPjAm3rN2h1xHPtq1qVwUSJFbS8RF3tU00YKHhsdI9");

class CardCollection extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
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
        return (
            <div>
                <NavBar />
                <Elements stripe={promise}>
                  <PaymentCollection />
                </Elements>
            </div>
        )
    }
}

export default CardCollection
