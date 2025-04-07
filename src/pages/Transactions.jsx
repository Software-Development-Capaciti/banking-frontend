import { useEffect, useState } from 'react';
import axios from 'axios';
import { CashStack, ArrowLeftRight, WalletFill, Wallet2, ClockHistory } from 'react-bootstrap-icons';

// DevBank color scheme
const colors = {
  primary: '#1976D2', // DevBank blue
  secondary: '#424242', // Dark gray
  accent: '#FFC107', // Amber accent
  success: '#43A047', // Green for positive actions
  text: '#212121', // Dark text
  lightText: '#757575', // Light text
  background: '#F5F5F5', // Light background
};

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [activeView, setActiveView] = useState('accounts');
  const [activeAccount, setActiveAccount] = useState(null);
  const [activeOperation, setActiveOperation] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
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

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/transactions/pay', {
        ...formData,
        accountType: activeAccount
      });
      setFormData({ amount: '', description: '', toAccount: '', fromAccount: '' });
      fetchTransactions();
      setShowTransactions(true);
      alert('Payment successful!');
    } catch (error) {
      console.error('Error making payment:', error);
      alert('Failed to make payment');
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
      setShowTransactions(true);
      alert('Transfer successful!');
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAccountsView = () => (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card h-100" style={{ borderColor: colors.primary }}>
          <div className="card-body">
            <div className="d-flex align-items-center mb-4">
              <WalletFill size={30} style={{ color: colors.primary }} className="me-3" />
              <div>
                <h3 className="mb-1" style={{ color: colors.text }}>Current Account</h3>
                <h4 className="mb-0" style={{ color: colors.primary }}>{formatAmount(25000)}</h4>
              </div>
            </div>
            <div className="d-grid gap-2">
              <button 
                className="btn"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: colors.primary,
                  color: colors.primary
                }}
                onClick={() => {
                  setActiveAccount('current');
                  setActiveOperation('pay');
                  setActiveView('current-operations');
                  setShowTransactions(false);
                }}
              >
                Pay
              </button>
              <button 
                className="btn"
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  color: 'white'
                }}
                onClick={() => {
                  setActiveAccount('current');
                  setActiveOperation('transfer');
                  setActiveView('current-operations');
                  setShowTransactions(false);
                }}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card h-100" style={{ borderColor: colors.accent }}>
          <div className="card-body">
            <div className="d-flex align-items-center mb-4">
              <Wallet2 size={30} style={{ color: colors.accent }} className="me-3" />
              <div>
                <h3 className="mb-1" style={{ color: colors.text }}>Savings Account</h3>
                <h4 className="mb-0" style={{ color: colors.accent }}>{formatAmount(50000)}</h4>
              </div>
            </div>
            <div className="d-grid gap-2">
              <button 
                className="btn"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: colors.accent,
                  color: colors.accent
                }}
                onClick={() => {
                  setActiveAccount('savings');
                  setActiveOperation('pay');
                  setActiveView('savings-operations');
                  setShowTransactions(false);
                }}
              >
                Pay
              </button>
              <button 
                className="btn"
                style={{
                  backgroundColor: colors.accent,
                  borderColor: colors.accent,
                  color: colors.text
                }}
                onClick={() => {
                  setActiveAccount('savings');
                  setActiveOperation('transfer');
                  setActiveView('savings-operations');
                  setShowTransactions(false);
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

  const renderTransactionHistory = () => {
    const accountTransactions = transactions.filter(t => t.accountType === activeAccount);
    const isCurrentAccount = activeAccount === 'current';
    const accentColor = isCurrentAccount ? colors.primary : colors.accent;
    
    return (
      <div className="mt-4">
        <div className="d-flex align-items-center mb-3">
          <ClockHistory size={20} style={{ color: accentColor }} className="me-2" />
          <h5 className="mb-0" style={{ color: colors.text }}>Recent Transactions</h5>
        </div>
        <div className="card" style={{ borderColor: accentColor }}>
          <div className="list-group list-group-flush">
            {accountTransactions.map((transaction, index) => (
              <div key={index} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-center">
                      {transaction.type === 'PAY' ? (
                        <CashStack size={16} style={{ color: colors.success }} className="me-2" />
                      ) : (
                        <ArrowLeftRight size={16} style={{ color: accentColor }} className="me-2" />
                      )}
                      <h6 className="mb-0" style={{ color: colors.text }}>{transaction.description}</h6>
                    </div>
                    <small style={{ color: colors.lightText }}>{formatDate(transaction.date)}</small>
                    {transaction.type === 'TRANSFER' && (
                      <small className="d-block" style={{ color: colors.lightText }}>
                        To: {transaction.toAccount}
                      </small>
                    )}
                  </div>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: transaction.type === 'PAY' ? colors.success : accentColor
                  }}>
                    {formatAmount(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
            {accountTransactions.length === 0 && (
              <div className="list-group-item text-center py-4" style={{ color: colors.lightText }}>
                No transactions yet
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOperationsView = () => {
    const isCurrentAccount = activeAccount === 'current';
    const accentColor = isCurrentAccount ? colors.primary : colors.accent;
    const accountIcon = isCurrentAccount ? <WalletFill size={24} /> : <Wallet2 size={24} />;
    const accountName = isCurrentAccount ? 'Current Account' : 'Savings Account';

    return (
      <>
        <div className="card" style={{ borderColor: accentColor }}>
          <div className="card-header d-flex align-items-center" 
            style={{ 
              backgroundColor: accentColor,
              color: isCurrentAccount ? 'white' : colors.text
            }}>
            <button 
              className="btn btn-link me-3 p-0"
              style={{ color: isCurrentAccount ? 'white' : colors.text }}
              onClick={() => {
                setActiveView('accounts');
                setShowTransactions(false);
              }}
            >
              ← Back
            </button>
            <div className="d-flex align-items-center">
              {accountIcon}
              <h5 className="mb-0 ms-2">{accountName} - {activeOperation === 'pay' ? 'Pay' : 'Transfer'}</h5>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={activeOperation === 'pay' ? handlePay : handleTransfer}>
              {activeOperation === 'transfer' && (
                <div className="mb-3">
                  <label className="form-label" style={{ color: colors.text }}>To Account</label>
                  <select 
                    className="form-select"
                    name="toAccount"
                    value={formData.toAccount}
                    onChange={handleInputChange}
                    required
                    style={{ borderColor: accentColor }}
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
                <label className="form-label" style={{ color: colors.text }}>Amount</label>
                <div className="input-group">
                  <span className="input-group-text" style={{ 
                    backgroundColor: accentColor,
                    color: isCurrentAccount ? 'white' : colors.text,
                    borderColor: accentColor
                  }}>R</span>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    style={{ borderColor: accentColor }}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: colors.text }}>Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter a description for this transaction"
                  style={{ borderColor: accentColor }}
                />
              </div>
              <div className="d-grid">
                <button 
                  type="submit" 
                  className="btn"
                  style={{
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    color: isCurrentAccount ? 'white' : colors.text
                  }}
                >
                  {activeOperation === 'pay' ? 'Pay' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {showTransactions && renderTransactionHistory()}
      </>
    );
  };

  return (
    <div className="container mt-4" style={{ backgroundColor: colors.background }}>
      {activeView === 'accounts' ? renderAccountsView() : renderOperationsView()}
    </div>
  );
}

export default Transactions;