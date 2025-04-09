import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';

function Cards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8080/api/cards')
      .then(response => {
        setCards(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cards:', error);
        setError('Failed to load cards');
        setLoading(false);
      });
  }, []);

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headingStyle = {
    marginBottom: '2rem',
    textAlign: 'center',
    fontSize: '2rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    padding: '0 1rem'
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const messageStyle = {
    textAlign: 'center',
    padding: '1rem',
    color: error ? '#dc3545' : '#000'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Cards</h2>
      {loading ? (
        <div style={messageStyle}>Loading...</div>
      ) : error ? (
        <div style={{ ...messageStyle, color: '#dc3545' }}>{error}</div>
      ) : (
        <div style={gridStyle}>
          {cards.map((card, index) => (
            <div style={columnStyle} key={index}>
              <Card 
                type={card.type} 
                number={card.number} 
                expiry={card.expiry} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cards;