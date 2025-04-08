import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CashStack, 
  ArrowLeftRight, 
  ArrowUp, 
  ArrowDown, 
  Calendar3, 
  Search, 
  SortDown, 
  Download, 
  Printer
} from 'react-bootstrap-icons';

function BankStatement() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [activeAccount, setActiveAccount] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  const [currentBalance, setCurrentBalance] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      padding: '1.5rem',
      margin: '1rem auto',
      maxWidth: '1200px'
    },
    header: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    statement: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    row: {
      borderBottom: '1px solid #eaedf0',
      padding: '1rem 0.5rem',
      transition: 'background-color 0.2s'
    },
    rowHover: {
      backgroundColor: '#f8fafb'
    },
    credit: {
      color: '#2ecc71',
      fontWeight: '500'
    },
    debit: {
      color: '#e74c3c',
      fontWeight: '500'
    },
    headerButton: {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      border: '1px solid #dee2e6',
      backgroundColor: '#ffffff',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    headerButtonHover: {
      backgroundColor: '#f8f9fa',
      borderColor: '#c6cad0'
    },
    balanceCard: {
      backgroundColor: '#325db0',
      color: 'white',
      borderRadius: '8px',
      padding: '1.25rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    filters: {
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem'
    },
    input: {
      borderRadius: '6px',
      border: '1px solid #dee2e6',
      padding: '0.5rem',
      width: '100%'
    },
    actionButton: {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      backgroundColor: '#325db0',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    actionButtonHover: {
      backgroundColor: '#254a8f'
    },
    transactionIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '0.75rem'
    },
    paginationButton: {
      padding: '0.5rem 0.75rem',
      margin: '0 0.25rem',
      borderRadius: '6px',
      border: '1px solid #dee2e6',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
    },
    paginationActive: {
      backgroundColor: '#325db0',
      color: 'white',
      borderColor: '#325db0'
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, dateRange, activeAccount, searchTerm, sortConfig]);

  const fetchAllTransactions = async () => {
    setIsLoading(true);
    try {
      const currentResponse = await axios.get('http://localhost:8080/api/transactions/current');
      const savingsResponse = await axios.get('http://localhost:8080/api/transactions/savings');
      const paymentsResponse = await axios.get('http://localhost:8080/api/payments');
      
      const currentTransactions = currentResponse.data.map(tx => ({
        ...tx,
        accountType: 'Current Account',
        accountNumber: '1234567890'
      }));
      
      const savingsTransactions = savingsResponse.data.map(tx => ({
        ...tx,
        accountType: 'Savings Account',
        accountNumber: '0987654321'
      }));
      
      // Transform payments into transaction format
      const paymentTransactions = paymentsResponse.data.map(payment => ({
        id: `payment-${payment.id || Math.random().toString(36).substr(2, 9)}`,
        date: payment.date,
        description: payment.description || `Payment to ${payment.user}`,
        amount: payment.amount,
        type: 'debit', // Assume payments are debits
        accountType: payment.accountType || 'Current Account',
        accountNumber: '1234567890',
        category: 'Payment',
        user: payment.user
      }));
      
      // Combine all transactions
      const allTransactions = [
        ...currentTransactions,
        ...savingsTransactions,
        ...paymentTransactions
      ];
      
      setTransactions(allTransactions);
      
      // Calculate current balance from transactions
      const balance = allTransactions.reduce((acc, tx) => {
        if (tx.type === 'credit') {
          return acc + parseFloat(tx.amount);
        } else {
          return acc - parseFloat(tx.amount);
        }
      }, 25000); // Starting with a base balance of 25000
      
      setCurrentBalance(balance);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];
    
    // Filter by date range
    filtered = filtered.filter(tx => {
      const txDate = new Date(tx.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59); // Include the entire end day
      
      return txDate >= startDate && txDate <= endDate;
    });
    
    // Filter by account
    if (activeAccount !== 'all') {
      filtered = filtered.filter(tx => 
        tx.accountType.toLowerCase().includes(activeAccount.toLowerCase())
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.description?.toLowerCase().includes(term) ||
        tx.category?.toLowerCase().includes(term) ||
        tx.recipientName?.toLowerCase().includes(term) ||
        tx.recipientAccountNumber?.includes(term) ||
        tx.user?.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (sortConfig.direction === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else if (sortConfig.key === 'amount') {
        const amountA = parseFloat(a.amount);
        const amountB = parseFloat(b.amount);
        
        if (sortConfig.direction === 'asc') {
          return amountA - amountB;
        } else {
          return amountB - amountA;
        }
      } else {
        // For description or other string fields
        const valueA = a[sortConfig.key] || '';
        const valueB = b[sortConfig.key] || '';
        
        if (sortConfig.direction === 'asc') {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      }
    });
    
    setFilteredTransactions(filtered);
  };

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (transaction) => {
    const iconStyle = {
      ...styles.transactionIcon,
      backgroundColor: transaction.type === 'credit' ? '#ebfaf0' : '#feeeea'
    };
    
    if (transaction.category === 'Payment' || transaction.description?.includes('Pay')) {
      return (
        <div style={{ ...iconStyle, backgroundColor: '#feeeea' }}>
          <CashStack size={16} color="#e74c3c" />
        </div>
      );
    } else if (transaction.description?.includes('Transfer')) {
      return (
        <div style={{ ...iconStyle, backgroundColor: '#e7f5fe' }}>
          <ArrowLeftRight size={16} color="#3498db" />
        </div>
      );
    } else if (transaction.type === 'credit') {
      return (
        <div style={{ ...iconStyle, backgroundColor: '#ebfaf0' }}>
          <ArrowDown size={16} color="#2ecc71" />
        </div>
      );
    } else {
      return (
        <div style={{ ...iconStyle, backgroundColor: '#feeeea' }}>
          <ArrowUp size={16} color="#e74c3c" />
        </div>
      );
    }
  };

  const getTransactionCategory = (transaction) => {
    if (transaction.category) {
      return transaction.category;
    }
    
    if (transaction.description?.includes('Transfer')) {
      return 'Transfer';
    } else if (transaction.description?.includes('Deposit')) {
      return 'Deposit';
    } else if (transaction.description?.includes('Withdrawal')) {
      return 'Withdrawal';
    } else if (transaction.description?.includes('Pay')) {
      return 'Payment';
    }
    
    return transaction.type === 'credit' ? 'Income' : 'Expense';
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'Transfer': '#3498db',
      'Deposit': '#2ecc71',
      'Withdrawal': '#e74c3c',
      'Payment': '#e74c3c',
      'Income': '#2ecc71',
      'Expense': '#e74c3c'
    };
    
    return categoryColors[category] || '#7f8c8d';
  };

  const groupTransactionsByDate = () => {
    const grouped = {};
    
    filteredTransactions.forEach(tx => {
      const date = tx.date.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(tx);
    });
    
    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([date, transactions]) => ({
        date,
        transactions
      }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">Account Statement</h2>
            <p className="text-muted mb-0">
              {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
            </p>
          </div>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <button 
              style={styles.headerButton} 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Search size={14} className="me-2" />
              Filter
            </button>
            <button style={styles.headerButton}>
              <Download size={14} className="me-2" />
              Export
            </button>
            <button style={styles.headerButton}>
              <Printer size={14} className="me-2" />
              Print
            </button>
          </div>
        </div>
        
        <div className="row g-3">
          <div className="col-md-4">
            <div style={styles.balanceCard}>
              <h6 className="mb-2">Current Balance</h6>
              <h3 className="mb-0">{formatAmount(currentBalance)}</h3>
            </div>
          </div>
          <div className="col-md-8">
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="text-muted mb-2">Total Income</h6>
                    <h4 className="mb-0" style={styles.credit}>
                      {formatAmount(
                        transactions
                          .filter(tx => tx.type === 'credit')
                          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                      )}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="text-muted mb-2">Total Expenses</h6>
                    <h4 className="mb-0" style={styles.debit}>
                      {formatAmount(
                        transactions
                          .filter(tx => tx.type === 'debit')
                          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                      )}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div style={styles.filters} className="mt-4">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Account</label>
                <select
                  className="form-select"
                  value={activeAccount}
                  onChange={(e) => setActiveAccount(e.target.value)}
                  style={styles.input}
                >
                  <option value="all">All Accounts</option>
                  <option value="current">Current Account</option>
                  <option value="savings">Savings Account</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div style={styles.statement}>
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your statement...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-5">
            <h5>No transactions found</h5>
            <p className="text-muted">Try adjusting your filters or date range</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('date')} style={{cursor: 'pointer'}}>
                      Date {sortConfig.key === 'date' && (
                        <SortDown size={12} className={sortConfig.direction === 'desc' ? '' : 'rotate-180'} />
                      )}
                    </th>
                    <th>Description</th>
                    <th>Account</th>
                    <th>Category</th>
                    <th onClick={() => handleSort('amount')} style={{cursor: 'pointer', textAlign: 'right'}}>
                      Amount {sortConfig.key === 'amount' && (
                        <SortDown size={12} className={sortConfig.direction === 'desc' ? '' : 'rotate-180'} />
                      )}
                    </th>
                    <th style={{textAlign: 'right'}}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {groupTransactionsByDate().map(group => {
                    let runningBalance = currentBalance;
                    
                    return (
                      <>
                        <tr key={`date-${group.date}`} style={{backgroundColor: '#f8f9fa'}}>
                          <td colSpan="6">
                            <div className="d-flex align-items-center">
                              <Calendar3 size={14} className="me-2" />
                              <strong>{formatDate(group.date)}</strong>
                            </div>
                          </td>
                        </tr>
                        
                        {group.transactions.map((transaction, index) => {
                          // Calculate running balance for each transaction
                          if (transaction.type === 'debit') {
                            runningBalance += parseFloat(transaction.amount);
                          } else {
                            runningBalance -= parseFloat(transaction.amount);
                          }
                          
                          const category = getTransactionCategory(transaction);
                          
                          return (
                            <tr 
                              key={transaction.id || index} 
                              style={styles.row}
                              className="transaction-row"
                            >
                              <td>
                                <div className="d-flex align-items-center">
                                  {getTransactionIcon(transaction)}
                                  <div>
                                    {new Date(transaction.date).toLocaleDateString()}
                                    <br />
                                    <small className="text-muted">
                                      {new Date(transaction.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="fw-medium">{transaction.description}</div>
                                  {transaction.recipientName && (
                                    <small className="text-muted d-block">
                                      To: {transaction.recipientName} {transaction.recipientAccountNumber && `(${transaction.recipientAccountNumber})`}
                                    </small>
                                  )}
                                  {transaction.user && (
                                    <small className="text-muted d-block">
                                      User: {transaction.user}
                                    </small>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="fw-medium">{transaction.accountType}</div>
                                <small className="text-muted">{transaction.accountNumber}</small>
                              </td>
                              <td>
                                <span 
                                  className="badge" 
                                  style={{
                                    backgroundColor: getCategoryColor(category) + '20',
                                    color: getCategoryColor(category),
                                    padding: '4px 8px',
                                    borderRadius: '4px'
                                  }}
                                >
                                  {category}
                                </span>
                              </td>
                              <td style={{textAlign: 'right'}}>
                                <span style={transaction.type === 'credit' ? styles.credit : styles.debit}>
                                  {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                                </span>
                              </td>
                              <td style={{textAlign: 'right'}}>
                                {formatAmount(runningBalance)}
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                <small className="text-muted">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </small>
              </div>
              <div className="d-flex">
                <button style={{...styles.paginationButton, ...styles.paginationActive}}>1</button>
                <button style={styles.paginationButton}>2</button>
                <button style={styles.paginationButton}>3</button>
                <button style={styles.paginationButton}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BankStatement;