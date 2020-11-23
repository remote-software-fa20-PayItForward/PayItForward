import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import FrontPage from './FrontPage';
import HomePage from './HomePage';
import Register from './Register';
import Login from './Login';
import MFA from './MFA';
import UserPage from './UserPage';
import AccountsSummary from './AccountsSummary';
import ManageBanks from './ManageBanks';
import BankAccounts from './BankAccounts';
import Transactions from './Transactions'
import SuccessfulPayment from './SuccessfulPayment'
import Donate from './Donate'
import DonationRequest from './DonationRequest'
import MySprout from './MySprout'
import StripeOnboarding from './StripeOnboarding';
import SuccessfulOnboard from './SuccessfulOnboard'

function App() {
  return (
    <Router>
      <Route exact path="/" component={FrontPage} />
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/mfa" component={MFA} />
      <Route exact path="/userpage" component={UserPage} />
      <Route exact path="/donate" component={Donate} />
      <Route exact path="/accounts-summary" component={AccountsSummary} />
      <Route exact path="/manage-banks" component={ManageBanks} />
      <Route exact path="/banks/:bankId/accounts" component={BankAccounts} />
      <Route exact path="/donation-success" component={SuccessfulPayment} />
      {/* /transactions/current-month || /transactions/last-month */} 
      <Route exact path="/transactions/:month" component={Transactions} />
      <Route exact path="/donation-request" component={DonationRequest} />
      <Route exact path="/my-sprout" component={MySprout} />
      <Route exact path="/stripe-onboarding" component={StripeOnboarding} />
      <Route exact path="/successful-onboard" component={SuccessfulOnboard} />
    </Router>
  );
}

export default App;
