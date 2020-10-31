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
            <Card style={{marginTop: 50, marginBottom: 50}}>
            <Container>
                <Row className="justify-content-md-center"><h1>Pay it Forward</h1></Row>
                <Row className="justify-content-md-center" style={{padding: 10, paddingBottom: 5}}><Link to="/login"><Button variant="primary">Login</Button></Link></Row>
                <Row className="justify-content-md-center" style={{padding: 10, paddingTop: 5}}><Link to="/register"><Button variant="primary">Create an Account</Button></Link></Row>
            </Container></Card>
        </div>
    );
}

export default HomePage;