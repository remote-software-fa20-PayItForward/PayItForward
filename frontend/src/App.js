import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import FrontPage from './FrontPage';
import HomePage from './HomePage';
import Register from './Register';
import Login from './Login';
import MFA from './MFA';
import UserPage from './UserPage';
<<<<<<< HEAD
import AccountsSummary from './AccountsSummary';
import ManageBanks from './ManageBanks';
import BankAccounts from './BankAccounts';
=======
import LinkBank from './LinkBank'
import Accounts from './Accounts'
>>>>>>> 4a150ab88dce54decaaa554455c2cf9d2da35437
import Transactions from './Transactions'
import SuccessfulPayment from './SuccessfulPayment'

function App() {
  return (
    <Router>
      <Route exact path="/" component={FrontPage} />
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/mfa" component={MFA} />
      <Route exact path="/userpage" component={UserPage} />
<<<<<<< HEAD
      <Route exact path="/accounts-summary" component={AccountsSummary} />
      <Route exact path="/manage-banks" component={ManageBanks} />
      <Route exact path="/banks/:bankId/accounts" component={BankAccounts} />
      <Route exact path="/donation-success" component={SuccessfulPayment} />
      {/* /transactions/current-month || /transactions/last-month */} 
      <Route exact path="/transactions/:month" component={Transactions} />
=======
      <Route exact path="/link-bank-account" component={LinkBank} />
      <Route exact path="/banks/:bankId/accounts" component={Accounts} />
      <Route exact path="/banks/:bankId/accounts/:accountId/transactions" component={Transactions} />
      <Route exact path="/donation-success" component={SuccessfulPayment} />
>>>>>>> 4a150ab88dce54decaaa554455c2cf9d2da35437
    </Router>
  );
}

export default App;
