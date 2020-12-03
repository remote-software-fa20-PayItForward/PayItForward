import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React, { Component } from "react";
import NavBar from './Navbar'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
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
                if (onboardingWindow) {
                  var timer = window.setInterval((function() {
                    if (onboardingWindow.closed) {
                        window.clearInterval(timer);
                        e.target.removeAttribute("disabled");
                        e.target.textContent = "Onboard";
                        fetch("/stripe/account").then(response => response.json()).then(body => {
                          if (body.details_submitted && body.charges_enabled) {
                            this.props.history.push('/successful-onboard');
                          }
                        })
                    }
                  }).bind(this), 200);
                } else {
                  e.target.removeAttribute("disabled");
                  e.target.textContent = "Onboard";
                }
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

                <Row className="justify-content-center mt-5">
                	<CardGroup className="pl-3 pb-3 text-center">
                		<Card className="mr-3 text-dark rounded text-left shadow p-3">
                			<Card.Body>
                				<h3 className="font-weight-bold purple-text">Wait a sec!</h3>
                				<hr />
                				<p className="lead">You need to connect your bank account in order to receive donations. <br />
                					Click on the button below to connect your account.
                				</p>
                				<div style={{textAlign: "center"}}>
                				<Button onClick={(e)=>{this.submit(e);}}>Onboard</Button>
                				</div>
                			</Card.Body>
                	  </Card>
                	</CardGroup>
                </Row>

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
