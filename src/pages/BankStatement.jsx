import { useEffect, useState } from 'react';
import { Search, Filter, Download } from 'react-bootstrap-icons';
import './BankStatement.css'; // Import the CSS file

// Local storage keys
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

  // Category color mapping
  const categoryColors = {
    'Food & Dining': '#FF9800',
    'Transportation': '#2196F3',
    'Bills & Utilities': '#F44336',
    'Income': '#4CAF50',
    'Transfer': '#9C27B0',
    'Payment': '#E91E63',
    'Other': '#607D8B'
  };

  // Load transactions from local storage
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

  // Handlers for filters and search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleAccountTypeFilterChange = (e) => {
    setFilterAccountType(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setFilterDateRange({
      ...filterDateRange,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterAccountType('');
    setFilterDateRange({
      startDate: '',
      endDate: ''
    });
  };

  // Filter transactions
  const filterTransactions = (transactions) => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        searchTerm === '' ||
        (transaction.description &&
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.category &&
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        filterCategory === '' ||
        (transaction.category && transaction.category === filterCategory);

      const matchesAccountType =
        filterAccountType === '' ||
        (transaction.accountType && transaction.accountType === filterAccountType);

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

  // Format amount
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return 'R0.00';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Export CSV
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

  const filteredTransactions = filterTransactions(transactions);

  return (
    <div className="bank-statement-container">
      <div className="bank-statement-card">
        <h2 className="mb-4">Bank Statement</h2>

        {/* Search and filter section */}
        <div className="search-bar">
          <Search size={16} className="me-2" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="btn btn-sm ms-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
          </button>
          <button
            className="btn btn-sm ms-2 btn-custom"
            onClick={exportStatementCSV}
            title="Export as CSV"
          >
            <Download size={16} />
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="filter-container">
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <label className="form-label small">Category</label>
                <select
                  className="form-select form-select-sm"
                  value={filterCategory}
                  onChange={handleCategoryFilterChange}
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
                <label className="form-label small">Account Type</label>
                <select
                  className="form-select form-select-sm"
                  value={filterAccountType}
                  onChange={handleAccountTypeFilterChange}
                >
                  <option value="">All Accounts</option>
                  <option value="current">Current Account</option>
                  <option value="savings">Savings Account</option>
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small">From Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  name="startDate"
                  value={filterDateRange.startDate}
                  onChange={handleDateFilterChange}
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small">To Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  name="endDate"
                  value={filterDateRange.endDate}
                  onChange={handleDateFilterChange}
                />
              </div>
            </div>
            <div className="mt-3 text-end">
              <button
                className="btn btn-sm btn-clear"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Transactions table */}
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="statement-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Account</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.description}</td>
                    <td
                      style={{
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
                    <td>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                    <td>
                      {transaction.category && (
                        <span
                          className="category-badge"
                          style={{
                            backgroundColor:
                              categoryColors[transaction.category] || categoryColors['Other'],
                            color: '#fff'
                          }}
                        >
                          {transaction.category}
                        </span>
                      )}
                    </td>
                    <td>
                      {transaction.accountType.charAt(0).toUpperCase() +
                        transaction.accountType.slice(1)}
                    </td>
                    <td>
                      {transaction.balance ? formatAmount(transaction.balance) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BankStatement;