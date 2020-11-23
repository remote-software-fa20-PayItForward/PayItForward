import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React, { Component } from "react";
import NavBar from './Navbar'
import Button from 'react-bootstrap/Button';
import ReactDOM from 'react-dom';
//import ScriptTag from 'react-script-tag';



class StripeOnboarding extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.submit = this.submit.bind(this);
    }

    submit(){
        fetch("/onboard-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(response => response.json())
            .then(data => {
              if (data.url) {
                window.location = data.url;
              } else {
                //elmButton.removeAttribute("disabled");
                //elmButton.textContent = "<Something went wrong>";
                console.log("data", data);
              }
            });
    }
    componentDidMount(){
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.async = true;
  
      document.body.appendChild(script);
    }
    render() {
        return (
            <div>
                <NavBar />
                <div>
                    <h1></h1>
                    <Button onClick={(e)=>{this.submit();}}>Onboard</Button>
                </div>
            </div>
        )
    }
}

export default StripeOnboarding



/*
let elmButton = document.querySelector("#submit");

if (elmButton) {
  elmButton.addEventListener(
    "click",
    e => {
      elmButton.setAttribute("disabled", "disabled");
      elmButton.textContent = "Opening...";

      fetch("/onboard-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.url) {
            window.location = data.url;
          } else {
            elmButton.removeAttribute("disabled");
            elmButton.textContent = "<Something went wrong>";
            console.log("data", data);
          }
        });
    },
    false
  );
}
*/
