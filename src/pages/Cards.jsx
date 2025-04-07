import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';

function Cards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/cards')
      .then(response => setCards(response.data))
      .catch(error => console.error('Error fetching cards:', error));
  }, []);

  return (
    <div>
      <h2 className="mb-4">Cards</h2>
      <div className="row">
        {cards.map((card, index) => (
          <div className="col-md-4" key={index}>
            <Card type={card.type} number={card.number} expiry={card.expiry} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cards;