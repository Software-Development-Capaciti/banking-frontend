import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CashStack, 
  ArrowLeftRight, 
  ArrowUp, 
  ArrowDown, 
  Calendar3, 
  Search, 
  FilePdf, 
  Download
} from 'react-bootstrap-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function BankStatement({ activeAccount = 'all', refreshTrigger = 0 }) {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [statementSummary, setStatementSummary] = useState({
    openingBalance: 0,
    closingBalance: 0,
    totalCredits: 0,
    totalDebits: 0
  });

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    statementHeader: {
      borderBottom: '2px solid #e0e0e0',
      marginBottom: '2rem',
      paddingBottom: '1rem'
    },
    accountInfo: {
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '2rem'
    },
    summaryBox: {
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    credit: { color: '#2ecc71' },
    debit: { color: '#e74c3c' }
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeAccount, refreshTrigger]);

  useEffect(() => {
    calculateSummary();
  }, [transactions]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Fetch both transactions and payments
      const [transactionsRes, paymentsRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/transactions/${activeAccount}`),
        axios.get('http://localhost:8080/api/payments')
      ]);

      // Convert payments to transaction format
      const paymentTransactions = paymentsRes.data.map(payment => ({
        id: `payment-${payment.id}`,
        date: payment.date,
        description: `Payment: ${payment.description || payment.recipientName}`,
        amount: payment.amount,
        type: 'debit',
        reference: payment.reference,
        balance: payment.balance,
        recipientName: payment.recipientName,
        recipientAccountNumber: payment.recipientAccountNumber
      }));

      // Combine and sort all transactions by date
      const allTransactions = [...transactionsRes.data, ...paymentTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Calculate running balance
      let runningBalance = 0;
      const processedTransactions = allTransactions.map(transaction => {
        if (transaction.type === 'credit') {
          runningBalance += transaction.amount;
        } else {
          runningBalance -= transaction.amount;
        }
        return { ...transaction, balance: runningBalance };
      });

      setTransactions(processedTransactions);
      setFilteredTransactions(processedTransactions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setIsLoading(false);
    }
  };

  const calculateSummary = () => {
    if (transactions.length === 0) return;

    const summary = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'credit') {
        acc.totalCredits += transaction.amount;
      } else {
        acc.totalDebits += transaction.amount;
      }
      return acc;
    }, {
      totalCredits: 0,
      totalDebits: 0
    });

    const firstTransaction = transactions[transactions.length - 1];
    const lastTransaction = transactions[0];

    setStatementSummary({
      openingBalance: firstTransaction ? firstTransaction.balance : 0,
      closingBalance: lastTransaction ? lastTransaction.balance : 0,
      totalCredits: summary.totalCredits,
      totalDebits: summary.totalDebits
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'credit':
        return <ArrowDown className="text-success" />;
      case 'debit':
        return <ArrowUp className="text-danger" />;
      default:
        return <CashStack />;
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add bank logo and header
    doc.setFontSize(20);
    doc.text('Bank Statement', 105, 15, { align: 'center' });
    
    // Add statement period
    doc.setFontSize(12);
    doc.text(`Statement Period: ${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`, 14, 25);
    
    // Add account information
    doc.text('Account Information:', 14, 35);
    doc.text(`Account Type: ${activeAccount.toUpperCase()}`, 14, 42);
    doc.text('Account Number: XXXX-XXXX-XXXX', 14, 49);
    
    // Add summary information
    doc.text('Statement Summary:', 14, 60);
    doc.text(`Opening Balance: ${formatAmount(statementSummary.openingBalance)}`, 14, 67);
    doc.text(`Closing Balance: ${formatAmount(statementSummary.closingBalance)}`, 14, 74);
    doc.text(`Total Credits: ${formatAmount(statementSummary.totalCredits)}`, 14, 81);
    doc.text(`Total Debits: ${formatAmount(statementSummary.totalDebits)}`, 14, 88);
    
    // Add transactions table
    const tableData = filteredTransactions.map(transaction => [
      formatDate(transaction.date),
      transaction.description,
      transaction.reference || '-',
      `${transaction.type === 'credit' ? '+' : '-'}${formatAmount(transaction.amount)}`,
      formatAmount(transaction.balance)
    ]);
    
    doc.autoTable({
      startY: 95,
      head: [['Date', 'Description', 'Reference', 'Amount', 'Balance']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [50, 93, 176] }
    });
    
    doc.save('bank-statement.pdf');
  };
  
  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Description', 'Reference', 'Amount', 'Balance'],
      ...filteredTransactions.map(transaction => [
        formatDate(transaction.date),
        transaction.description,
        transaction.reference || '-',
        `${transaction.type === 'credit' ? '+' : '-'}${formatAmount(transaction.amount)}`,
        formatAmount(transaction.balance)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bank-statement.csv';
    link.click();
  };

  return (
    <div style={styles.container}>
      {/* Statement Header */}
      <div style={styles.statementHeader}>
        <h2 className="mb-4">Bank Statement</h2>
        <div className="row">
          <div className="col-md-6">
            <h5>Statement Period</h5>
            <p>{formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}</p>
          </div>
          <div className="col-md-6 text-end">
            <button className="btn btn-primary me-2" onClick={exportToPDF}>
              <FilePdf /> Download PDF
            </button>
            <button className="btn btn-secondary" onClick={exportToCSV}>
              <Download /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div style={styles.accountInfo}>
        <div className="row">
          <div className="col-md-6">
            <h5>Account Information</h5>
            <p className="mb-1">Account Type: {activeAccount.toUpperCase()}</p>
            <p className="mb-1">Account Number: XXXX-XXXX-XXXX</p>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-6">
                <p className="mb-1">Opening Balance:</p>
                <h5>{formatAmount(statementSummary.openingBalance)}</h5>
              </div>
              <div className="col-6">
                <p className="mb-1">Closing Balance:</p>
                <h5>{formatAmount(statementSummary.closingBalance)}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div style={styles.summaryBox}>
        <div className="row text-center">
          <div className="col-md-6">
            <p className="mb-1">Total Credits</p>
            <h5 className="text-success">{formatAmount(statementSummary.totalCredits)}</h5>
          </div>
          <div className="col-md-6">
            <p className="mb-1">Total Debits</p>
            <h5 className="text-danger">{formatAmount(statementSummary.totalDebits)}</h5>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table style={styles.table} className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Reference</th>
                <th className="text-end">Amount</th>
                <th className="text-end">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={transaction.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {getTransactionIcon(transaction.type)}
                      <div className="ms-2">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                  </td>
                  <td>{transaction.description}</td>
                  <td>{transaction.reference || '-'}</td>
                  <td className="text-end">
                    <span style={transaction.type === 'credit' ? styles.credit : styles.debit}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </span>
                  </td>
                  <td className="text-end">{formatAmount(transaction.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BankStatement;
