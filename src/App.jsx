import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1" style={{ paddingTop: '60px' }}> {/* Add padding to account for fixed navbar */}
          <Navbar />
          <div className="container-fluid p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;