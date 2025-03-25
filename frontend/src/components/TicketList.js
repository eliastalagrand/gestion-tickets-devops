import React, { useEffect, useState } from 'react';

function TicketList({ token, role }) {
  const [tickets, setTickets] = useState([]);

  // Fonction pour récupérer la liste des tickets
  const fetchTickets = () => {
    fetch('/tickets', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error('Erreur lors de la récupération des tickets:', err));
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  // Fonction pour changer le statut d'un ticket via l'endpoint dédié "/tickets/:id/status"
  const handleChangeStatus = (ticketId, newStatus) => {
    fetch(`/tickets/${ticketId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ statut: newStatus })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de la mise à jour du statut');
        }
        return res.json();
      })
      .then(data => {
        console.log('Statut mis à jour:', data);
        // Rafraîchir la liste pour afficher le nouveau statut
        fetchTickets();
      })
      .catch(err => console.error('Erreur lors du changement de statut:', err));
  };

  return (
    <div>
      <h2>Liste des Tickets</h2>
      <button onClick={fetchTickets}>Rafraîchir la liste</button>
      {tickets.length === 0 ? (
        <p>Aucun ticket trouvé.</p>
      ) : (
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
              <p><strong>ID:</strong> {ticket.id}</p>
              <p><strong>Titre:</strong> {ticket.titre}</p>
              <p><strong>Description:</strong> {ticket.description}</p>
              <p><strong>Statut:</strong> {ticket.statut}</p>
              <p><strong>Priorité:</strong> {ticket.priorite}</p>
              <p><strong>Date de création:</strong> {new Date(ticket.date_creation).toLocaleString()}</p>
              <p><strong>Date de mise à jour:</strong> {new Date(ticket.date_mise_a_jour).toLocaleString()}</p>
              <p><strong>Employé créateur (ID):</strong> {ticket.id_employe}</p>
              <p><strong>Technicien assigné:</strong> {ticket.id_technicien ? ticket.id_technicien : "Non assigné"}</p>
              {(role === 'Technicien' || role === 'Admin') && ticket.statut !== 'Fermé' && (
                <>
                  <button onClick={() => handleChangeStatus(ticket.id, 'En cours')}>En cours</button>
                  <button onClick={() => handleChangeStatus(ticket.id, 'Résolu')}>Résolu</button>
                  <button onClick={() => handleChangeStatus(ticket.id, 'Fermé')}>Fermer</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TicketList;
