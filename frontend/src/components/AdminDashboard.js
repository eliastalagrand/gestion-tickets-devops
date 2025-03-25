import React, { useState, useEffect } from 'react';

function AdminDashboard({ token }) {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    open: 0,
    resolved: 0,
    avgResolutionTime: "N/A",
    critical: 0,
  });

  // Récupérer la liste des utilisateurs
  const fetchUsers = () => {
    fetch('/users', {  // Assurez-vous que cet endpoint existe
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Erreur lors de la récupération des utilisateurs:', err));
  };

  // Récupérer la liste des tickets pour l'attribution
  const fetchTickets = () => {
    fetch('/tickets', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error('Erreur lors de la récupération des tickets:', err));
  };

  // Récupérer les statistiques (implémentez cet endpoint côté backend)
  const fetchStats = () => {
    fetch('/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Erreur lors de la récupération des statistiques:', err));
  };

  useEffect(() => {
    fetchUsers();
    fetchTickets();
    fetchStats();
  }, [token]);

  // Suppression d'un utilisateur
  const handleDeleteUser = (userId) => {
    fetch(`/users/${userId}`, {  // Assurez-vous que cet endpoint DELETE existe
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          setUsers(users.filter(u => u.id !== userId));
        }
      })
      .catch(err => console.error('Erreur lors de la suppression de l’utilisateur:', err));
  };

  // Attribution manuelle d'un ticket à un technicien
  const handleAssignTicket = (ticketId, technicianId) => {
    fetch(`/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id_technicien: technicianId })
    })
      .then(res => res.json())
      .then(data => {
        // Mettre à jour la liste localement
        setTickets(tickets.map(t => t.id === ticketId ? { ...t, id_technicien: technicianId } : t));
      })
      .catch(err => console.error('Erreur lors de l’attribution du ticket:', err));
  };

  return (
    <div>
      <h2>Tableau de Bord Administrateur</h2>

      {/* Gestion des Utilisateurs */}
      <section>
        <h3>Gestion des Utilisateurs</h3>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.nom} ({user.role}) - {user.email}
              <button onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
              {/* Vous pouvez ajouter ici un formulaire pour modifier le rôle ou ajouter un nouvel utilisateur */}
            </li>
          ))}
        </ul>
      </section>

      {/* Attribution manuelle des tickets */}
      <section>
        <h3>Attribution manuelle des Tickets</h3>
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id}>
              Ticket #{ticket.id} - {ticket.titre} - Technicien assigné: {ticket.id_technicien || "Non assigné"}
              <button onClick={() => {
                const techId = prompt("Entrez l'ID du technicien à assigner:");
                if (techId) handleAssignTicket(ticket.id, parseInt(techId));
              }}>Attribuer Technicien</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Statistiques */}
      <section>
        <h3>Statistiques</h3>
        <p>Nombre total de tickets ouverts: {stats.open}</p>
        <p>Nombre total de tickets résolus: {stats.resolved}</p>
        <p>Temps moyen de résolution par technicien: {stats.avgResolutionTime}</p>
        <p>Tickets critiques: {stats.critical}</p>
      </section>
    </div>
  );
}

export default AdminDashboard;
