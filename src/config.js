// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default {
  API_URL,
  endpoints: {
    dashboard: `${API_URL}/api/dashboard`,
    transactions: `${API_URL}/api/transactions`,
    cards: `${API_URL}/api/cards`,
    payments: `${API_URL}/api/payments`,
    profile: `${API_URL}/api/profile`
  }
};
