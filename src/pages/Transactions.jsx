import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDownCircleFill, ArrowUpCircleFill, ArrowLeftRight, WalletFill, Wallet2 } from 'react-bootstrap-icons';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [activeView, setActiveView] = useState('accounts'); // 'accounts', 'current-operations', 'savings-operations'
  const [activeAccount, setActiveAccount] = useState(null); // 'current' or 'savings'
  const [activeOperation, setActiveOperation] = useState(null); // 'deposit' or 'transfer'
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    toAccount: '',
    fromAccount: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    axios.get('http://localhost:8080/api/transactions')
      .then(response => setTransactions(response.data))
      .catch(error => console.error('Error fetching transactions:', error));
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/transactions/deposit', {
        ...formData,
        accountType: activeAccount
      });
      setFormData({ amount: '', description: '', toAccount: '', fromAccount: '' });
      fetchTransactions();
      alert('Deposit successful!');
      setActiveView('accounts');
    } catch (error) {
      console.error('Error making deposit:', error);
      alert('Failed to make deposit');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/transactions/transfer', {
        ...formData,
        fromAccount: activeAccount
      });
      setFormData({ amount: '', description: '', toAccount: '', fromAccount: '' });
      fetchTransactions();
      alert('Transfer successful!');
      setActiveView('accounts');
    } catch (error) {
      console.error('Error making transfer:', error);
      alert('Failed to make transfer');
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const renderAccountsView = () => (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex align-items-center mb-4">
              <WalletFill size={30} className="text-primary me-3" />
              <div>
                <h3 className="mb-1">Current Account</h3>
                <h4 className="text-primary mb-0">{formatAmount(25000)}</h4>
              </div>
            </div>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  setActiveAccount('current');
                  setActiveOperation('deposit');
                  setActiveView('current-operations');
                }}
              >
                Deposit
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  setActiveAccount('current');
                  setActiveOperation('transfer');
                  setActiveView('current-operations');
                }}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex align-items-center mb-4">
              <Wallet2 size={30} className="text-success me-3" />
              <div>
                <h3 className="mb-1">Savings Account</h3>
                <h4 className="text-success mb-0">{formatAmount(50000)}</h4>
              </div>
            </div>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-outline-success"
                onClick={() => {
                  setActiveAccount('savings');
                  setActiveOperation('deposit');
                  setActiveView('savings-operations');
                }}
              >
                Deposit
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={() => {
                  setActiveAccount('savings');
                  setActiveOperation('transfer');
                  setActiveView('savings-operations');
                }}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOperationsView = () => {
    const isCurrentAccount = activeAccount === 'current';
    const accountColor = isCurrentAccount ? 'primary' : 'success';
    const accountIcon = isCurrentAccount ? <WalletFill size={24} /> : <Wallet2 size={24} />;
    const accountName = isCurrentAccount ? 'Current Account' : 'Savings Account';

    return (
      <div className="card">
        <div className={`card-header bg-${accountColor} text-white d-flex align-items-center`}>
          <button 
            className="btn btn-link text-white me-3 p-0"
            onClick={() => setActiveView('accounts')}
          >
            ← Back
          </button>
          <div className="d-flex align-items-center">
            {accountIcon}
            <h5 className="mb-0 ms-2">{accountName} - {activeOperation === 'deposit' ? 'Deposit' : 'Transfer'}</h5>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={activeOperation === 'deposit' ? handleDeposit : handleTransfer}>
            {activeOperation === 'transfer' && (
              <div className="mb-3">
                <label className="form-label">To Account</label>
                <select 
                  className="form-select"
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select account</option>
                  {activeAccount === 'current' ? (
                    <option value="savings">Savings Account</option>
                  ) : (
                    <option value="current">Current Account</option>
                  )}
                </select>
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <div className="input-group">
                <span className="input-group-text">R</span>
                <input
                  type="number"
                  className="form-control"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter a description for this transaction"
              />
            </div>
            <div className="d-grid">
              <button 
                type="submit" 
                className={`btn btn-${accountColor}`}
              >
                {activeOperation === 'deposit' ? 'Deposit' : 'Transfer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      {activeView === 'accounts' ? renderAccountsView() : renderOperationsView()}
    </div>
  );
}

export default Transactions;