import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React, { Component } from "react";
import CheckoutForm from "./CheckoutForm.js";
import "./Donate.css"; 
import NavBar from './Navbar'

const promise = loadStripe("pk_test_51HhIVhKJyyCVsqcoeOjgBymqqNJRf5R1tt8U5D0Ksu0AT3lyHSrkN55DHPjAm3rN2h1xHPtq1qVwUSJFbS8RF3tU00YKHhsdI9");

class Donate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            donationAmount: ""
        }
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="Donate">
                    <h1></h1>
                    <Elements stripe={promise}>
                        <CheckoutForm />
                    </Elements>       
                </div>
            </div>
        )
    }
}

export default Donate
