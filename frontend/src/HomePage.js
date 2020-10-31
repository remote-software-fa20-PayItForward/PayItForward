import './HomePage.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Pay it Forward</Navbar.Brand>
            </Navbar>
            
            <div className="homepage">
                <div className="form">
                    <form className="login-form" method="POST">
                        <img id="logo" src="/payitforwardlogo.png" />
                        <br />
                        <input type="text" name="username" placeholder="email" required/>
                        <input type="password" name="password" placeholder="password"required />
                        <button>login</button>
                        <p className="message">Not registered? <a href="register">Create an account</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default HomePage;