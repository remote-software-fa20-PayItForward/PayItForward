import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React, { Component } from "react";
import AddCardForm from "./AddCardForm.js";
import NavBar from './Navbar'

const promise = loadStripe("pk_test_51HhIVhKJyyCVsqcoeOjgBymqqNJRf5R1tt8U5D0Ksu0AT3lyHSrkN55DHPjAm3rN2h1xHPtq1qVwUSJFbS8RF3tU00YKHhsdI9");

class AddCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            donationAmount: ""
        }
    }

    componentDidMount() {
        fetch('/user').then((response) => {
            response.json().then((body) => {
                if (!body.username) {
                    this.props.history.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
                }
            })
        })
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="Donate">
                    <h1></h1>
                    <Elements stripe={promise}>
                        <AddCardForm />
                    </Elements>       
                </div>
            </div>
        )
    }
}

export default AddCard
