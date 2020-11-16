import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Register from './Register';
import Login from './Login';
import MFA from './MFA';
import UserPage from './UserPage';
import LinkBank from './LinkBank'
import Accounts from './Accounts'
import Transactions from './Transactions'
import SuccessfulPayment from './SuccessfulPayment'

function App() {
  return (
    <Router>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/mfa" component={MFA} />
      <Route exact path="/userpage" component={UserPage} />
      <Route exact path="/link-bank-account" component={LinkBank} />
      <Route exact path="/banks/:bankId/accounts" component={Accounts} />
      <Route exact path="/banks/:bankId/accounts/:accountId/transactions" component={Transactions} />
      <Route exact path="/donation-success" component={SuccessfulPayment} />
    </Router>
  );
}

export default App;
