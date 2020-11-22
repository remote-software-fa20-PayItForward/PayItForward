import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React, { Component } from "react";
import NavBar from './Navbar'



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
                elmButton.removeAttribute("disabled");
                elmButton.textContent = "<Something went wrong>";
                console.log("data", data);
              }
            });
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="Donate">
                    <h1></h1>
                    
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