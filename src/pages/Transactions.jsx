import { useEffect, useState } from 'react';
import axios from 'axios';
import { CashStack, ArrowLeftRight, WalletFill, Wallet2, ClockHistory, ArrowLeft } from 'react-bootstrap-icons';

// Add responsive styles
const styles = {
  accountCard: {
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: '100%',
    minHeight: '200px',
    marginBottom: '1rem'
  },
  accountCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  balanceCard: {
    height: '100%',
    minHeight: '120px',
    marginBottom: '1rem'
  },
  transactionItem: {
    transition: 'background-color 0.2s',
    padding: '1rem',
    borderLeft: '4px solid transparent',
    width: '100%',
    overflowX: 'hidden'
  },
  transactionItemHover: {
    backgroundColor: '#f8f9fa'
  },
  container: {
    maxWidth: '1200px',
    width: '100%',
    padding: '1rem',
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  transactionAmount: {
    wordBreak: 'break-word',
    textAlign: 'right',
    minWidth: '100px'
  },
  formContainer: {
    maxWidth: '100%',
    margin: '0 auto'
  }
};

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [activeView, setActiveView] = useState('accounts');
  const [activeAccount, setActiveAccount] = useState(null);
  const [activeOperation, setActiveOperation] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredTransaction, setHoveredTransaction] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    toAccount: '',
    recipientName: '',
    recipientAccountNumber: ''
  });

  useEffect(() => {
    if (activeAccount) {
      fetchTransactions();
    }
  }, [activeAccount]);

  useEffect(() => {
    // Reset form data when operation type changes
    setFormData({
      amount: '',
      description: '',
      toAccount: '',
      recipientName: '',
      recipientAccountNumber: ''
    });
    setSuccessMessage('');
  }, [activeOperation]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/transactions/${activeAccount}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      const transaction = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        accountType: activeAccount,
        type: 'PAY',
        recipientName: formData.recipientName,
        recipientAccountNumber: formData.recipientAccountNumber
      };

      console.log('Sending payment:', transaction);
      const response = await axios.post('http://localhost:8080/api/transactions/pay', transaction);
      console.log('Payment response:', response.data);
      
      if (response.data) {
        // Reset form
        setFormData({
          amount: '',
          description: '',
          toAccount: '',
          recipientName: '',
          recipientAccountNumber: ''
        });

        // Show success message
        setSuccessMessage(`Payment of ${formatAmount(transaction.amount)} to ${transaction.recipientName} was successful!`);

        // Refresh transactions
        await fetchTransactions();

        // Show transactions
        setShowTransactions(true);
      }
    } catch (error) {
      console.error('Error making payment:', error.response || error);
      setSuccessMessage(
        `Failed to make payment: ${error.response?.data?.message || error.message || 'Unknown error'}`
      );
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const transaction = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        accountType: activeAccount,
        type: 'TRANSFER',
        toAccount: formData.toAccount
      };

      console.log('Sending transfer:', transaction);
      const response = await axios.post('http://localhost:8080/api/transactions/transfer', transaction);
      console.log('Transfer response:', response.data);
      
      if (response.data) {
        // Reset form
        setFormData({
          amount: '',
          description: '',
          toAccount: '',
          recipientName: '',
          recipientAccountNumber: ''
        });

        // Show success message
        setSuccessMessage(`Transfer of ${formatAmount(transaction.amount)} to your ${formData.toAccount} account was successful!`);

        // Refresh transactions
        await fetchTransactions();

        // Show transactions
        setShowTransactions(true);
      }
    } catch (error) {
      console.error('Error making transfer:', error.response || error);
      setSuccessMessage(
        `Failed to make transfer: ${error.response?.data?.message || error.message || 'Unknown error'}`
      );
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
      day: 'numeric'
    });
  };

  const renderTransactionHistory = () => {
    if (!transactions.length) {
      return (
        <div className="card mt-4">
          <div className="card-body text-center py-5">
            <h5 className="text-muted mb-0">No transactions found</h5>
          </div>
        </div>
      );
    }

    return (
      <div className="card mt-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Transaction History</h5>
        </div>
        <div className="list-group list-group-flush">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="list-group-item"
              style={{
                ...styles.transactionItem,
                ...(hoveredTransaction === index ? styles.transactionItemHover : {}),
                borderLeftColor: transaction.amount < 0 ? '#dc3545' : '#198754'
              }}
              onMouseEnter={() => setHoveredTransaction(index)}
              onMouseLeave={() => setHoveredTransaction(null)}
            >
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h6 className="mb-1">{transaction.description}</h6>
                  <p className="text-muted small mb-0">
                    {formatDate(transaction.date)}
                    {transaction.type === 'PAY' && transaction.recipientName && (
                      <> • {transaction.recipientName}</>
                    )}
                    {transaction.type === 'PAY' && transaction.recipientAccountNumber && (
                      <> • Account: {transaction.recipientAccountNumber}</>
                    )}
                  </p>
                </div>
                <div style={styles.transactionAmount}>
                  <span className={transaction.amount < 0 ? 'text-danger' : 'text-success'}>
                    {formatAmount(transaction.amount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAccountsView = () => (
    <div className="row g-4">
      <div className="col-md-6">
        <div 
          className="card h-100"
          style={{
            ...styles.accountCard,
            ...(hoveredCard === 'current' ? styles.accountCardHover : {})
          }}
          onMouseEnter={() => setHoveredCard('current')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => {
            setActiveAccount('current');
            setActiveView('transactions');
            setShowTransactions(true);
            fetchTransactions();
          }}
        >
          <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
            <WalletFill size={48} className="text-primary mb-3" />
            <h3 className="card-title mb-3">Current Account</h3>
            <h4 className="text-primary mb-3">{formatAmount(25000)}</h4>
            <p className="card-text text-muted">Your everyday spending account</p>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div 
          className="card h-100"
          style={{
            ...styles.accountCard,
            ...(hoveredCard === 'savings' ? styles.accountCardHover : {})
          }}
          onMouseEnter={() => setHoveredCard('savings')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => {
            setActiveAccount('savings');
            setActiveView('transactions');
            setShowTransactions(true);
            fetchTransactions();
          }}
        >
          <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
            <Wallet2 size={48} className="text-success mb-3" />
            <h3 className="card-title mb-3">Savings Account</h3>
            <h4 className="text-success mb-3">{formatAmount(50000)}</h4>
            <p className="card-text text-muted">Your long-term savings account</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactionsView = () => {
    const isCurrentAccount = activeAccount === 'current';
    const accountColor = isCurrentAccount ? 'primary' : 'success';
    const accountIcon = isCurrentAccount ? <WalletFill size={24} /> : <Wallet2 size={24} />;
    const accountName = isCurrentAccount ? 'Current Account' : 'Savings Account';
    const balance = isCurrentAccount ? 25000 : 50000;

    return (
      <div style={styles.container}>
        <div className="card">
          <div className={`card-header bg-${accountColor} text-white`}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <button 
                  className="btn btn-link text-white p-0"
                  onClick={() => setActiveView('accounts')}
                >
                  ← Back
                </button>
                <div className="d-flex align-items-center">
                  {accountIcon}
                  <h5 className="mb-0 ms-2">{accountName}</h5>
                </div>
              </div>
              <div>
                <h5 className="mb-0">Available: {formatAmount(balance)}</h5>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card h-100" 
                  style={{
                    ...styles.accountCard,
                    ...(hoveredCard === 'pay' ? styles.accountCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard('pay')}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => {
                    setActiveOperation('pay');
                    setActiveView(`${activeAccount}-operations`);
                  }}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                    <CashStack size={48} className={`text-${accountColor} mb-3`} />
                    <h3 className="card-title mb-3">Pay</h3>
                    <p className="card-text text-muted">Make a payment from your {accountName.toLowerCase()}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100"
                  style={{
                    ...styles.accountCard,
                    ...(hoveredCard === 'transfer' ? styles.accountCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard('transfer')}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => {
                    setActiveOperation('transfer');
                    setActiveView(`${activeAccount}-operations`);
                  }}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                    <ArrowLeftRight size={48} className={`text-${accountColor} mb-3`} />
                    <h3 className="card-title mb-3">Transfer</h3>
                    <p className="card-text text-muted">Transfer money between your accounts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {renderTransactionHistory()}
      </div>
    );
  };

  const renderOperationsView = () => {
    const isCurrentAccount = activeAccount === 'current';
    const accountColor = isCurrentAccount ? 'primary' : 'success';
    const accountIcon = isCurrentAccount ? <WalletFill size={24} /> : <Wallet2 size={24} />;
    const accountName = isCurrentAccount ? 'Current Account' : 'Savings Account';
    const balance = isCurrentAccount ? 25000 : 50000;

    return (
      <div style={{ ...styles.formContainer, overflowX: 'hidden' }}>
        <div className="card">
          <div className={`card-header bg-${accountColor} text-white`}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <button 
                  className="btn btn-link text-white p-0"
                  onClick={() => {
                    setActiveView('transactions');
                    setShowTransactions(false);
                    setActiveOperation(null);
                    setSuccessMessage('');
                  }}
                >
                  ← Back
                </button>
                <div className="d-flex align-items-center">
                  {accountIcon}
                  <h5 className="mb-0 ms-2">{accountName}</h5>
                </div>
              </div>
              <div>
                <h5 className="mb-0">Available: {formatAmount(balance)}</h5>
              </div>
            </div>
          </div>
          <div className="card-body">
            {successMessage && (
              <div className={`alert alert-${successMessage.includes('Failed') ? 'danger' : 'success'} mb-4`}>
                {successMessage}
              </div>
            )}
            <form onSubmit={activeOperation === 'pay' ? handlePay : handleTransfer} className="mx-auto" style={{ maxWidth: '600px' }}>
              {activeOperation === 'transfer' ? (
                <div className="mb-3">
                  <label className="form-label">To Account</label>
                  <select 
                    className="form-select form-select-lg"
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
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Recipient Name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter recipient's name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Recipient Account Number</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="recipientAccountNumber"
                      value={formData.recipientAccountNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter recipient's account number"
                      pattern="[0-9]*"
                      minLength="10"
                      maxLength="10"
                    />
                  </div>
                </>
              )}
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <div className="input-group input-group-lg">
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
              <div className="mb-4">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
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
                  className={`btn btn-${accountColor} btn-lg`}
                >
                  {activeOperation === 'pay' ? 'Pay' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {showTransactions && renderTransactionHistory()}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {activeView === 'accounts' && renderAccountsView()}
      {activeView === 'transactions' && renderTransactionsView()}
      {(activeView === 'current-operations' || activeView === 'savings-operations') && renderOperationsView()}
    </div>
  );
}

export default Transactions;