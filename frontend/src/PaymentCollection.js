import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import React from "react";

export default function PaymentCollection(){
  const stripe = useStripe();
  const elements = useElements();
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
  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.

    // Use your card Element with other Stripe.js APIs
    const cardElement = elements.getElement(CardElement);
    const cardholderName = document.getElementById('cardholder-name');
    const resultContainer = document.getElementById('card-result');
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: cardholderName.value,
      },
    });

    if (error) {
      console.log('[error]', error);
      resultContainer.textContent = error;
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      resultContainer.textContent = "Created payment method: " + paymentMethod.id;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input id="cardholder-name" placeholder="Name" type="text"></input>
      <CardElement options={cardStyle}/>
      <div id="card-result"></div>
      <button type="submit" disabled={!stripe}>
        Save Card
      </button>
    </form>
  );
};