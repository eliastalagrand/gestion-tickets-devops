import React, { useEffect, useState } from 'react';

function TicketList({ token }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch('/tickets', {
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez le token si la route est protégée
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(error => console.error('Erreur lors du chargement des tickets:', error));
  }, [token]);

  return (
    <div>
      <h2>Liste des Tickets</h2>
      {tickets.length === 0 ? (
        <p>Aucun ticket trouvé.</p>
      ) : (
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id}>
              <strong>{ticket.titre}</strong> : {ticket.description}
              {/* Ajoutez ici des boutons pour modifier ou supprimer si vous le souhaitez */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TicketList;
