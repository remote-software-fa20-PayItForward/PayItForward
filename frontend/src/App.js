import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Register from './Register';
import Login from './Login';
import MFA from './MFA';
import UserPage from './UserPage';

function App() {
  return (
    <Router>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/mfa" component={MFA} />
      <Route exact path="/userpage" component={UserPage} />
    </Router>
  );
}

export default App;
