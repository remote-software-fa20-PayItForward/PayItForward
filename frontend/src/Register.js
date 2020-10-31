import './Register.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function Register() {
    return(
    
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Pay it Forward</Navbar.Brand>
            </Navbar>
            
            <div className="homepage">
                <div className="form">
                    <form className="register-form" method="POST">
                        <br />
                        <div style={{float: 'left'}}>
                          <input type="text" name="first" placeholder="first name" size={10} required />
                        </div>
                        <div style={{float: 'right'}}>
                          <input type="text" name="last" placeholder="last name" size={10} required />
                        </div>
                        <input type="password" name="password" placeholder="password" required />
                        <input type="text" name="username" placeholder="email address" required />
                        <button>create</button>
                        <p className="message">Already registered? <a href="/">Sign In</a></p>
                    </form>
                </div>
            </div>
            
        </div>
    
    );
}

export default Register;