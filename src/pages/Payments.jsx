import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowLeftRight, 
  ArrowUp, 
  ArrowDown, 
  Calendar3, 
  Search, 
  SortDown, 
  Download,
  Trash,
  CheckCircleFill,
  Filter,
  XCircle
} from 'react-bootstrap-icons';

// Configure axios
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;

// Local storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: 'banking_transactions',
  ACCOUNT_BALANCES: 'banking_account_balances'
};

function Payments() {
  const [activeAccount, setActiveAccount] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredTransaction, setHoveredTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateRange, setFilterDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [accountBalances, setAccountBalances] = useState({
    current: 0,
    savings: 0
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Styles for transaction history
  const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      padding: '1.5rem',
      margin: '1rem auto',
      maxWidth: '1200px'
    },
    transactionHistory: {
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      padding: '1.5rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    transactionHeader: {
      marginBottom: '1.5rem'
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      marginTop: '1rem'
    },
    filterContainer: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '1rem'
    },
    transactionItem: {
      transition: 'background-color 0.2s',
      padding: '1rem',
      borderLeft: '4px solid transparent',
      marginBottom: '0.5rem',
      borderRadius: '0 8px 8px 0',
      backgroundColor: '#f8f9fa'
    },
    transactionItemHover: {
      backgroundColor: '#e9ecef'
    },
    transactionAmount: {
      textAlign: 'right',
      minWidth: '100px'
    },
    categoryBadge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      marginTop: '5px'
    },
    alertSuccess: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '0.75rem 1.25rem',
      marginBottom: '1rem',
      borderRadius: '0.25rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    alertError: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '0.75rem 1.25rem',
      marginBottom: '1rem',
      borderRadius: '0.25rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  };

  // Category colors for transaction types
  const categoryColors = {
    'Food & Dining': '#FF9800',
    'Transportation': '#2196F3',
    'Bills & Utilities': '#F44336',
    'Income': '#4CAF50',
    'Transfer': '#9C27B0',
    'Payment': '#E91E63',
    'Other': '#607D8B'
  };

  // Listen for transaction updates
  useEffect(() => {
    // Set up polling to check for new transactions more frequently (every 3 seconds)
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Fetch transactions and account balances when component mounts or refreshTrigger changes
  useEffect(() => {
    fetchTransactions();
    fetchAccountBalances();
  }, [refreshTrigger, activeAccount]);

  // Auto-dismiss success and error messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Fetch account balances
  const fetchAccountBalances = async () => {
    try {
      const timestamp = new Date().getTime(); // Add cache-busting parameter
      const response = await axios.get(`http://localhost:8080/api/accounts/balances?_=${timestamp}`);
      setAccountBalances(response.data);
      
      // Store in localStorage as fallback
      localStorage.setItem(STORAGE_KEYS.ACCOUNT_BALANCES, JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching account balances:', error);
      // If backend is not available, use stored balances
      const storedBalances = localStorage.getItem(STORAGE_KEYS.ACCOUNT_BALANCES);
      if (storedBalances) {
        try {
          setAccountBalances(JSON.parse(storedBalances));
        } catch (e) {
          console.error('Error parsing stored account balances:', e);
        }
      }
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const timestamp = new Date().getTime(); // Add cache-busting parameter
      const response = await axios.get(`http://localhost:8080/api/transactions?_=${timestamp}`);
      
      // Transform data if needed
      const transformedTransactions = response.data.map(transaction => ({
        ...transaction,
        date: new Date(transaction.date)
      }));
      
      setTransactions(transformedTransactions);
      
      // Store in localStorage as fallback
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transformedTransactions));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      
      // If backend is not available, use stored transactions
      const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (storedTransactions) {
        try {
          const parsedTransactions = JSON.parse(storedTransactions);
          // Convert date strings back to Date objects
          const transformedTransactions = parsedTransactions.map(transaction => ({
            ...transaction,
            date: new Date(transaction.date)
          }));
          setTransactions(transformedTransactions);
        } catch (e) {
          console.error('Error parsing stored transactions:', e);
          setErrorMessage('Failed to load transactions. Please try again later.');
        }
      }
      
      setIsLoading(false);
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle category filter change
  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  // Function to handle date range filter change
  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterDateRange({
      startDate: '',
      endDate: ''
    });
    
    // Reset form elements
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
  };

  // Function to export transactions as CSV
  const exportTransactionsCSV = () => {
    // Filter transactions for the active account
    let filteredTransactions = transactions;
    if (activeAccount !== 'all') {
      filteredTransactions = transactions.filter(t => t.accountType === activeAccount);
    }
    
    // Apply search and filters
    filteredTransactions = filterTransactions(filteredTransactions);
    
    // Create CSV content
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type', 'Account'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        formatDate(t.date),
        `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in description
        t.category || 'Uncategorized',
        t.amount,
        t.type,
        t.accountType
      ].join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${activeAccount}_${formatDate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSuccessMessage('Transactions exported successfully!');
  };

  // Function to filter transactions based on search and filters
  const filterTransactions = (transactionsToFilter) => {
    return transactionsToFilter.filter(transaction => {
      // Filter by search term
      const matchesSearch = !searchTerm || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.category && transaction.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by category
      const matchesCategory = !filterCategory || transaction.category === filterCategory;
      
      // Filter by date range
      const transactionDate = new Date(transaction.date);
      const matchesStartDate = !filterDateRange.startDate || transactionDate >= new Date(filterDateRange.startDate);
      const matchesEndDate = !filterDateRange.endDate || transactionDate <= new Date(filterDateRange.endDate);
      
      return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
    });
  };

  // Format amount with currency symbol
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (transactionId) => {
    if (!transactionId || isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      await axios.delete(`http://localhost:8080/api/transactions/${transactionId}`);
      
      // Update local state
      setTransactions(prevTransactions => {
        const updatedTransactions = prevTransactions.filter(t => t.id !== transactionId);
        
        // Update localStorage
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
        
        return updatedTransactions;
      });
      
      // Fetch updated account balances
      fetchAccountBalances();
      
      setSuccessMessage('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setErrorMessage('Failed to delete transaction. Please try again.');
      
      // If backend is not available, simulate deletion in local state
      if (!navigator.onLine) {
        setTransactions(prevTransactions => {
          const updatedTransactions = prevTransactions.filter(t => t.id !== transactionId);
          
          // Update localStorage
          localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
          
          return updatedTransactions;
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Render transaction history component
  const renderTransactionHistory = () => {
    const filteredTransactions = filterTransactions(transactions);
    
    return (
      <div className="card" style={{ backgroundColor: '#2A3B3C', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: 'none', maxWidth: '800px', width: '100%' }}>
        <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#00C4B4', color: 'white', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h5 className="mb-0">Transaction History</h5>
          <div className="d-flex">
            <button 
              className="btn btn-sm me-2" 
              onClick={() => setShowFilters(!showFilters)}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
            >
              <Filter className="me-1" /> Filters
            </button>
            <button 
              className="btn btn-sm" 
              onClick={exportTransactionsCSV}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
            >
              <Download className="me-1" /> Export CSV
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="card-body border-bottom" style={{ backgroundColor: '#1A2526' }}>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text" style={{ backgroundColor: '#3A4B4C', border: '1px solid #3A4B4C', color: 'white' }}>
                    <Search />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ backgroundColor: '#3A4B4C', color: 'white', border: '1px solid #3A4B4C' }}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filterCategory}
                  onChange={handleCategoryFilterChange}
                  style={{ backgroundColor: '#3A4B4C', color: 'white', border: '1px solid #3A4B4C' }}
                >
                  <option value="">All Categories</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="transfer">Transfers</option>
                  <option value="payment">Payments</option>
                </select>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <input
                    type="date"
                    className="form-control"
                    value={filterDateRange.startDate}
                    onChange={(e) => handleDateFilterChange({ ...e, target: { ...e.target, name: 'startDate' } })}
                    style={{ backgroundColor: '#3A4B4C', color: 'white', border: '1px solid #3A4B4C' }}
                  />
                  <span className="input-group-text" style={{ backgroundColor: '#3A4B4C', border: '1px solid #3A4B4C', color: 'white' }}>to</span>
                  <input
                    type="date"
                    className="form-control"
                    value={filterDateRange.endDate}
                    onChange={(e) => handleDateFilterChange({ ...e, target: { ...e.target, name: 'endDate' } })}
                    style={{ backgroundColor: '#3A4B4C', color: 'white', border: '1px solid #3A4B4C' }}
                  />
                </div>
              </div>
              <div className="col-md-1">
                <button
                  className="btn btn-sm w-100"
                  onClick={clearFilters}
                  style={{ backgroundColor: '#00C4B4', color: 'white', border: 'none' }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="card-body" style={{ color: 'white' }}>
          {filteredTransactions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover" style={{ color: 'white' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Account</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} style={{ backgroundColor: 'transparent', borderColor: '#3A4B4C' }}>
                      <td>{formatDate(transaction.date)}</td>
                      <td>{transaction.description}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: '#3A4B4C', color: 'white' }}>{transaction.type}</span>
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: '#3A4B4C', color: 'white' }}>{transaction.accountType}</span>
                      </td>
                      <td className="text-end" style={{ color: transaction.amount < 0 ? '#FF5C5C' : '#00C4B4', fontWeight: 'bold' }}>
                        {formatAmount(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5" style={{ color: '#A0AEC0' }}>
              <p className="mb-0">No transactions found.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#1A2526', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 d-flex justify-content-center">
          <div className="card mb-4" style={{ maxWidth: '800px', width: '100%', backgroundColor: '#2A3B3C', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: 'none' }}>
            <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#00C4B4', color: 'white', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
              <h5 className="mb-0">Account Selection</h5>
              <div className="d-flex">
                {activeAccount !== 'all' && (
                  <div className="me-3 d-flex align-items-center">
                    <span className="fw-bold me-2">Balance:</span>
                    <span className="badge bg-dark fs-6">
                      {formatAmount(activeAccount === 'current' ? accountBalances.current : accountBalances.savings)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-center">
                <button 
                  className={`btn ${activeAccount === 'all' ? 'btn-info' : 'btn-outline-info'} m-1`}
                  onClick={() => setActiveAccount('all')}
                  style={{ width: '140px', backgroundColor: activeAccount === 'all' ? '#00C4B4' : 'transparent', borderColor: '#00C4B4', color: activeAccount === 'all' ? 'white' : '#00C4B4' }}
                >
                  All Accounts
                </button>
                <button 
                  className={`btn ${activeAccount === 'current' ? 'btn-info' : 'btn-outline-info'} m-1`}
                  onClick={() => setActiveAccount('current')}
                  style={{ width: '140px', backgroundColor: activeAccount === 'current' ? '#00C4B4' : 'transparent', borderColor: '#00C4B4', color: activeAccount === 'current' ? 'white' : '#00C4B4' }}
                >
                  Current
                </button>
                <button 
                  className={`btn ${activeAccount === 'savings' ? 'btn-info' : 'btn-outline-info'} m-1`}
                  onClick={() => setActiveAccount('savings')}
                  style={{ width: '140px', backgroundColor: activeAccount === 'savings' ? '#00C4B4' : 'transparent', borderColor: '#00C4B4', color: activeAccount === 'savings' ? 'white' : '#00C4B4' }}
                >
                  Savings
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 d-flex justify-content-center">
          {renderTransactionHistory()}
        </div>
      </div>
    </div>
  );
}

export default Payments;