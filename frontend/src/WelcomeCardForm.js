import React, { useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { withRouter } from 'react-router-dom';

export default withRouter(function WelcomeCardForm(props) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [name, setName] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    window
      .fetch("/stripe/create-setup-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        //body: JSON.stringify({items: [{ id: "donation" }]})
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
      });
  }, []);
  fetch('/user').then(response => {
    response.json().then(body => {
      if (body.username) {
        setName(body.first + " " + body.last);
      }
    })
  })
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };
  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name,
        }
      }
    });
    if (payload.error) {
      setError(`Setup failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      fetch('/stripe/paymentmethods').then((response) => {
        response.json().then(body => {
            fetch('/stripe/customer', {
              method: "POST",
              headers: {
                  'Content-type': 'application/json'
              },
              body: JSON.stringify({invoice_settings: {default_payment_method: body.data[0].id}})}).then((response) => {
                response.json().then(body => {
                  props.history.push('/welcome/donationrequest');
                });
              });
        });
    })
      
    }
  }
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
        <div className="card-element">
          <input className="CardField" id="name" type="text" placeholder="Name" required defaultValue={name} onChange={(e) => {setName(e.target.value);}} />
        </div>
      <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Add Card"
          )}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show a success message upon completion */}
      <p className={succeeded ? "result-message" : "result-message hidden"}>
        Setup succeeded
      </p>
    </form>
  );
})