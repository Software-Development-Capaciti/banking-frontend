import { useEffect, useState } from 'react';
import { Search, Filter, Download } from 'react-bootstrap-icons';

// Local storage keys (same as in Transactions.jsx)
const STORAGE_KEYS = {
  TRANSACTIONS: 'banking_transactions',
  ACCOUNT_BALANCES: 'banking_account_balances'
};

function BankStatement() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateRange, setFilterDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filterAccountType, setFilterAccountType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Styles (adapted from Transactions.jsx for consistency)
  const styles = {
    container: {
      backgroundColor: '#1A2526',
      minHeight: 'calc(100vh - 60px)',
      padding: '2rem',
      color: '#fff'
    },
    statementCard: {
      backgroundColor: '#2A3B3C',
      borderRadius: '15px',
      padding: '1.5rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      color: '#fff'
    },
    th: {
      padding: '1rem',
      textAlign: 'left',
      borderBottom: '1px solid #3A4B4C',
      fontWeight: 'bold'
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #3A4B4C'
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      backgroundColor: '#2A3B3C',
      borderRadius: '8px',
      padding: '0.5rem 1rem'
    },
    filterContainer: {
      backgroundColor: '#2A3B3C',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem'
    },
    button: {
      backgroundColor: '#00C4B4',
      border: 'none',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      color: 'white',
      cursor: 'pointer'
    },
    categoryBadge: {
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    }
  };

  // Category color mapping (same as in Transactions.jsx)
  const categoryColors = {
    'Food & Dining': '#FF9800',
    'Transportation': '#2196F3',
    'Bills & Utilities': '#F44336',
    'Income': '#4CAF50',
    'Transfer': '#9C27B0',
    'Payment': '#E91E63',
    'Other': '#607D8B'
  };

  // Load transactions from local storage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions);
        setTransactions(parsedTransactions);
        console.log('Loaded transactions for statement:', parsedTransactions.length);
      } catch (error) {
        console.error('Error parsing transactions from local storage:', error);
      }
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  // Handle account type filter change
  const handleAccountTypeFilterChange = (e) => {
    setFilterAccountType(e.target.value);
  };

  // Handle date range filter change
  const handleDateFilterChange = (e) => {
    setFilterDateRange({
      ...filterDateRange,
      [e.target.name]: e.target.value
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterAccountType('');
    setFilterDateRange({
      startDate: '',
      endDate: ''
    });
  };

  // Filter transactions based on search and filters
  const filterTransactions = (transactions) => {
    return transactions.filter((transaction) => {
      // Search term filter
      const matchesSearch =
        searchTerm === '' ||
        (transaction.description &&
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.category &&
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory =
        filterCategory === '' ||
        (transaction.category && transaction.category === filterCategory);

      // Account type filter
      const matchesAccountType =
        filterAccountType === '' ||
        (transaction.accountType && transaction.accountType === filterAccountType);

      // Date range filter
      let matchesDateRange = true;
      if (filterDateRange.startDate) {
        matchesDateRange =
          matchesDateRange &&
          new Date(transaction.date) >= new Date(filterDateRange.startDate);
      }
      if (filterDateRange.endDate) {
        matchesDateRange =
          matchesDateRange &&
          new Date(transaction.date) <= new Date(filterDateRange.endDate);
      }

      return matchesSearch && matchesCategory && matchesAccountType && matchesDateRange;
    });
  };

  // Format amount for display
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return 'R0.00';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Export transactions as CSV
  const exportStatementCSV = () => {
    const filteredTransactions = filterTransactions(transactions);
    const headers = [
      'Date',
      'Description',
      'Amount',
      'Type',
      'Category',
      'Account Type',
      'Balance'
    ];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map((t) => {
        return [
          `"${formatDate(t.date)}"`,
          `"${t.description}"`,
          t.amount,
          t.type,
          t.category || 'Other',
          t.accountType,
          t.balance || ''
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'bank_statement.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get filtered transactions
  const filteredTransactions = filterTransactions(transactions);

  return (
    <div style={styles.container}>
      <div style={styles.statementCard}>
        <h2 className="mb-4">Bank Statement</h2>

        {/* Search and filter section */}
        <div style={styles.searchBar}>
          <Search size={16} className="me-2" />
          <input
            type="text"
            className="form-control form-control-sm border-0 bg-transparent text-white"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="btn btn-sm ms-2"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              backgroundColor: showFilters ? '#3A4B4C' : 'transparent',
              color: '#fff'
            }}
          >
            <Filter size={16} />
          </button>
          <button
            className="btn btn-sm ms-2"
            onClick={exportStatementCSV}
            title="Export as CSV"
            style={styles.button}
          >
            <Download size={16} />
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div style={styles.filterContainer}>
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <label className="form-label small text-white">Category</label>
                <select
                  className="form-select form-select-sm"
                  value={filterCategory}
                  onChange={handleCategoryFilterChange}
                  style={{ backgroundColor: '#3A4B4C', color: '#fff' }}
                >
                  <option value="">All Categories</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Income">Income</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Payment">Payment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small text-white">Account Type</label>
                <select
                  className="form-select form-select-sm"
                  value={filterAccountType}
                  onChange={handleAccountTypeFilterChange}
                  style={{ backgroundColor: '#3A4B4C', color: '#fff' }}
                >
                  <option value="">All Accounts</option>
                  <option value="current">Current Account</option>
                  <option value="savings">Savings Account</option>
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small text-white">From Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  name="startDate"
                  value={filterDateRange.startDate}
                  onChange={handleDateFilterChange}
                  style={{ backgroundColor: '#3A4B4C', color: '#fff' }}
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small text-white">To Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  name="endDate"
                  value={filterDateRange.endDate}
                  onChange={handleDateFilterChange}
                  style={{ backgroundColor: '#3A4B4C', color: '#fff' }}
                />
              </div>
            </div>
            <div className="mt-3 text-end">
              <button
                className="btn btn-sm"
                onClick={clearFilters}
                style={{ ...styles.button, backgroundColor: '#3A4B4C' }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Transactions table */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No transactions found.</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Account</th>
                <th style={styles.th}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td style={styles.td}>{formatDate(transaction.date)}</td>
                  <td style={styles.td}>{transaction.description}</td>
                  <td
                    style={{
                      ...styles.td,
                      color:
                        transaction.type === 'credit' || transaction.type === 'deposit'
                          ? '#28a745'
                          : '#dc3545'
                    }}
                  >
                    {transaction.type === 'credit' || transaction.type === 'deposit'
                      ? '+'
                      : '-'}
                    {formatAmount(transaction.amount)}
                  </td>
                  <td style={styles.td}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </td>
                  <td style={styles.td}>
                    {transaction.category && (
                      <span
                        style={{
                          ...styles.categoryBadge,
                          backgroundColor:
                            categoryColors[transaction.category] || categoryColors['Other'],
                          color: '#fff'
                        }}
                      >
                        {transaction.category}
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {transaction.accountType.charAt(0).toUpperCase() +
                      transaction.accountType.slice(1)}
                  </td>
                  <td style={styles.td}>
                    {transaction.balance ? formatAmount(transaction.balance) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BankStatement;