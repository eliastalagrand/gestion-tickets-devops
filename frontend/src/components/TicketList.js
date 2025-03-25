import React, { useEffect, useState } from 'react';

function TicketList({ token, role }) {
  const [tickets, setTickets] = useState([]);
  const [techniciens, setTechniciens] = useState([]);

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

  // Fonction pour récupérer la liste complète des utilisateurs et filtrer les techniciens
  const fetchTechniciens = () => {
    fetch('/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        // Filtrer pour ne garder que les utilisateurs ayant le rôle "Technicien"
        const techs = data.filter(user => user.role === 'Technicien');
        setTechniciens(techs);
      })
      .catch(err => console.error('Erreur lors de la récupération des techniciens:', err));
  };

  useEffect(() => {
    fetchTickets();
    fetchTechniciens();
  }, [token]);

  // Fonction pour changer le statut et ajouter un commentaire via l'endpoint dédié
  const handleChangeStatus = (ticketId, newStatus, newComment) => {
    fetch(`/tickets/${ticketId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ statut: newStatus, commentaires: newComment })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de la mise à jour du statut');
        }
        return res.json();
      })
      .then(data => {
        console.log('Réponse du serveur:', data);
        fetchTickets();
      })
      .catch(err => console.error('Erreur lors du changement de statut:', err));
  };

  // Fonction pour attribuer un technicien via le menu déroulant
  const handleAssignTicket = (ticketId, technicianId) => {
    // Récupérer les données actuelles du ticket pour envoyer une mise à jour complète
    const ticketToUpdate = tickets.find(t => t.id === ticketId);
    if (!ticketToUpdate) return;

    const updatedTicket = {
      titre: ticketToUpdate.titre,
      description: ticketToUpdate.description,
      statut: ticketToUpdate.statut,
      priorite: ticketToUpdate.priorite,
      id_employe: ticketToUpdate.id_employe,
      id_technicien: technicianId,
      commentaires: ticketToUpdate.commentaires || ""
    };

    fetch(`/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedTicket)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Attribution mise à jour:', data);
        fetchTickets();
      })
      .catch(err => console.error('Erreur lors de l’attribution du ticket:', err));
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
              <p>
                <strong>Commentaires:</strong>{" "}
                {ticket.commentaires && ticket.commentaires.trim() !== ""
                  ? ticket.commentaires
                  : "Aucun commentaire"}
              </p>
              {(role === 'Technicien' || role === 'Admin') && ticket.statut !== 'Fermé' && (
                <>
                  <button onClick={() => {
                    const comment = prompt('Entrez votre commentaire pour ce changement de statut:');
                    if (comment !== null && comment.trim() !== "") {
                      handleChangeStatus(ticket.id, 'En cours', comment.trim());
                    }
                  }}>En cours</button>
                  <button onClick={() => {
                    const comment = prompt('Entrez votre commentaire pour ce changement de statut:');
                    if (comment !== null && comment.trim() !== "") {
                      handleChangeStatus(ticket.id, 'Résolu', comment.trim());
                    }
                  }}>Résolu</button>
                  <button onClick={() => {
                    const comment = prompt('Entrez votre commentaire pour ce changement de statut:');
                    if (comment !== null && comment.trim() !== "") {
                      handleChangeStatus(ticket.id, 'Fermé', comment.trim());
                    }
                  }}>Fermer</button>
                </>
              )}
              {role === 'Admin' && (
                <div>
                  <label>Attribuer technicien : </label>
                  <select
                    value={ticket.id_technicien || ""}
                    onChange={e => handleAssignTicket(ticket.id, parseInt(e.target.value))}
                  >
                    <option value="">-- Sélectionner un technicien --</option>
                    {techniciens.map(tech => (
                      <option key={tech.id} value={tech.id}>{tech.nom}</option>
                    ))}
                  </select>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TicketList;
