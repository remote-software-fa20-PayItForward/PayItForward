import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React, { Component } from "react";
import NavBar from './Navbar'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ReactDOM from 'react-dom';
//import ScriptTag from 'react-script-tag';



class StripeOnboarding extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.submit = this.submit.bind(this);
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

    submit(e){
      e.target.setAttribute("disabled", "disabled");
      e.target.textContent = "Opening...";
        fetch("/onboard-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(response => response.json())
            .then(data => {
              if (data.url) {
                //window.location = data.url;
                var onboardingWindow = window.open(data.url, "stripeConnect", "position=top,resizable=no,width=500,height=725.5,left=" + (window.screen.width / 2 - 250));
                var timer = window.setInterval(function() {
                  if (onboardingWindow.closed) {
                      window.clearInterval(timer);
                      e.target.removeAttribute("disabled");
                      e.target.textContent = "Onboard";
                      fetch("/stripe/account").then(response => response.json()).then(body => {
                        if (body.details_submitted && body.payments_enabled) {
                          this.props.history.push('/successful-onboard');
                        }
                      })
                  }
              }, 200);
              } else {
                e.target.removeAttribute("disabled");
                e.target.textContent = "<Something went wrong>";
                console.log("data", data);
              }
            });
    }

    render() {
        return (
            <div>
                <NavBar />
                <div style={{textAlign: "center"}}>
                    <h1></h1>
                    <Button onClick={(e)=>{this.submit(e);}}>Onboard</Button>
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
