import { useEffect, useState } from 'react';
import axios from 'axios';

// Configure axios
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
import { CashStack, ArrowLeftRight, WalletFill, Wallet2, ClockHistory, ArrowLeft } from 'react-bootstrap-icons';

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
  const [accountBalances, setAccountBalances] = useState({
    current: 1000,
    savings: 2000
  });

  const styles = {
    container: {
      backgroundColor: '#1A2526',
      minHeight: 'calc(100vh - 60px)',
      marginLeft: window.innerWidth < 768 ? '0' : '170px',
      paddingTop: '60px',
      overflowY: 'auto',
      boxSizing: 'border-box',
      width: window.innerWidth < 768 ? '100%' : 'calc(100% - 150px)',
      position: 'relative',
      padding: '1.5rem'
    },
    accountCard: {
      backgroundColor: '#2A3B3C',
      border: 'none',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      padding: '15px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    accountCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
    },
    transactionCard: {
      backgroundColor: '#2A3B3C',
      border: 'none',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      marginBottom: '1rem'
    },
    formContainer: {
      backgroundColor: '#1A2526',
      borderRadius: '15px',
      padding: '1.5rem'
    },
    input: {
      backgroundColor: '#2A3B3C',
      border: '1px solid #3A4B4C',
      color: 'white',
      borderRadius: '8px'
    },
    button: {
      backgroundColor: '#00C4B4',
      border: 'none',
      borderRadius: '8px',
      padding: '0.5rem 1.5rem',
      color: 'white',
      transition: 'background-color 0.2s'
    },
    buttonHover: {
      backgroundColor: '#00A89A'
    },
    transactionItem: {
      transition: 'background-color 0.2s',
      padding: '1rem',
      borderLeft: '4px solid transparent',
      width: '100%',
      overflowX: 'hidden'
    },
    transactionItemHover: {
      backgroundColor: '#2A3B3C'
    },
    transactionAmount: {
      wordBreak: 'break-word',
      textAlign: 'right',
      minWidth: '100px'
    }
  };

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

  useEffect(() => {
    // Fetch initial balances
    const fetchBalances = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard');
        setAccountBalances({
          current: response.data.currentBalance,
          savings: response.data.savingsBalance
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchBalances();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/transactions/${activeAccount}`);
      setTransactions(response.data);
      // Update balances after transaction
      const dashResponse = await axios.get('http://localhost:8080/api/dashboard');
      setAccountBalances({
        current: dashResponse.data.currentBalance,
        savings: dashResponse.data.savingsBalance
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'toAccount') {
      // Set recipient account number based on selected account
      const recipientAccountNumber = value === 'current' ? '1234567890' : value === 'savings' ? '9876543210' : '';
      setFormData(prev => ({
        ...prev,
        [name]: value,
        recipientAccountNumber
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Form data:', formData);
    console.log('Active operation:', activeOperation);
    console.log('Active account:', activeAccount);
    
    let payload;
    try {
      payload = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        type: activeOperation === 'pay' ? 'debit' : 'transfer',
        accountType: activeAccount,
        date: new Date().toISOString().split('T')[0],
        recipientName: formData.recipientName,
        recipientAccountNumber: formData.recipientAccountNumber,
        toAccount: activeOperation === 'transfer' ? formData.toAccount : null
      };

      const endpoint = activeOperation === 'pay' ? '/api/transactions/pay' : '/api/transactions/transfer';
      const response = await axios.post(`http://localhost:8080${endpoint}`, payload);

      if (response.data) {
        // Show success message
        setSuccessMessage(`${activeOperation === 'pay' ? 'Payment' : 'Transfer'} successful!`);
        
        // Clear form
        setFormData({
          amount: '',
          description: '',
          toAccount: '',
          recipientName: '',
          recipientAccountNumber: ''
        });

        // Refresh transactions
        fetchTransactions();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        payload: payload
      });
      alert(`Failed to process transaction: ${error.message}`);
    }
  };

  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return 'R0.00';
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
    return (
      <div className="mt-4">
        <div className="d-flex align-items-center mb-3">
          <ClockHistory size={24} className="me-2 text-white" />
          <h4 className="mb-0 text-white">Transaction History</h4>
        </div>
        <div className="card" style={styles.transactionCard}>
          <div className="card-body p-0">
            {transactions.length === 0 ? (
              <div className="text-center text-muted p-4">
                No transactions to display
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="list-group-item"
                    style={{
                      ...styles.transactionItem,
                      ...(hoveredTransaction === index ? styles.transactionItemHover : {})
                    }}
                    onMouseEnter={() => setHoveredTransaction(index)}
                    onMouseLeave={() => setHoveredTransaction(null)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1 text-white">
                          {transaction.description}
                        </h6>
                        <small className="text-muted">
                          {formatDate(transaction.date)}
                        </small>
                      </div>
                      <div
                        className={`text-${transaction.type === 'credit' ? 'success' : 'danger'}`}
                        style={styles.transactionAmount}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          <div className="card-body d-flex flex-column align-items-center justify-content-center text-center text-white">
            <WalletFill size={48} className="text-#00C4B4 mb-3" />
            <h3 className="card-title mb-3">Current Account</h3>
            <h4 className="text-#00C4B4 mb-3">{formatAmount(accountBalances.current)}</h4>
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
          <div className="card-body d-flex flex-column align-items-center justify-content-center text-center text-white">
            <Wallet2 size={48} className="text-#00C4B4 mb-3" />
            <h3 className="card-title mb-3">Savings Account</h3>
            <h4 className="text-#00C4B4 mb-3">{formatAmount(accountBalances.savings)}</h4>
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
    const balance = isCurrentAccount ? accountBalances.current : accountBalances.savings;

    return (
      <div style={styles.container}>
        <div className="card">
          <div className={`card-header bg-${accountColor} text-white`}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <button 
                  className="btn btn-link text-white p-0"
                  onClick={() => {
                    setActiveView('accounts');
                    setShowTransactions(false);
                    setActiveAccount(null);
                    setActiveOperation(null);
                    setFormData({
                      amount: '',
                      description: '',
                      toAccount: '',
                      recipientName: '',
                      recipientAccountNumber: ''
                    });
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
                  <div className="card-body d-flex flex-column align-items-center justify-content-center text-center text-white">
                    <CashStack size={48} className="text-#00C4B4 mb-3" />
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
                  <div className="card-body d-flex flex-column align-items-center justify-content-center text-center text-white">
                    <ArrowLeftRight size={48} className="text-#00C4B4 mb-3" />
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
    const balance = isCurrentAccount ? accountBalances.current : accountBalances.savings;

    return (
      <div style={styles.formContainer}>
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
              <div className="alert" style={{ backgroundColor: '#00C4B4', color: 'white' }} role="alert">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
              {activeOperation === 'transfer' ? (
                <div className="mb-3">
                  <label className="form-label">To Account</label>
                  <select 
                    className="form-select form-select-lg"
                    name="toAccount"
                    value={formData.toAccount}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  >
                    <option value="">Select account</option>
                    {activeAccount === 'current' ? (
                      <option value="savings" onClick={() => setFormData(prev => ({ ...prev, recipientAccountNumber: '9876543210' }))}>Savings Account (9876543210)</option>
                    ) : (
                      <option value="current" onClick={() => setFormData(prev => ({ ...prev, recipientAccountNumber: '1234567890' }))}>Current Account (1234567890)</option>
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
                      style={styles.input}
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
                      style={styles.input}
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
                    style={styles.input}
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
                  placeholder="Enter description"
                  style={styles.input}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg w-100"
                style={{ ...styles.button, backgroundColor: '#00C4B4' }}
              >
                {activeOperation === 'pay' ? 'Make Payment' : 'Transfer Money'}
              </button>
            </form>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div style={styles.container}>
      {activeView === 'accounts' && renderAccountsView()}
      {activeView.includes('operations') && (
        <div className="row">
          <div className="col-12 col-lg-6 mb-4">
            {renderOperationsView()}
          </div>
          <div className="col-12 col-lg-6">
            {renderTransactionHistory()}
          </div>
        </div>
      )}
      {activeView === 'transactions' && renderTransactionsView()}
    </div>
  );
}

export default Transactions;