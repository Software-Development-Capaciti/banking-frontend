import { useEffect, useState } from 'react';
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/transactions')
      .then(response => setTransactions(response.data))
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  return (
    <div>
      <h2 className="mb-4">Transactions</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Description</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.description}</td>
                <td>{transaction.date}</td>
                <td>${transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;