import { useEffect, useState } from 'react';
import axios from 'axios';

function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/payments')
      .then(response => setPayments(response.data))
      .catch(error => console.error('Error fetching payments:', error));
  }, []);

  return (
    <div>
      <h2 className="mb-4">Payments</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.user}</td>
                <td>{payment.date}</td>
                <td>${payment.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payments;