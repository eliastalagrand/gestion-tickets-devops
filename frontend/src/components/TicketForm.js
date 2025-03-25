import React, { useState } from 'react';

function TicketForm({ onTicketCreated, token }) {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    statut: 'Ouvert',    // Statut fixé à "Ouvert" par défaut lors de la création
    priorite: 'Faible',   // Champ Priorité avec valeur par défaut
    id_employe: 1         // Id de l'employé (à adapter selon l'utilisateur connecté)
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.message || data.id) {
          setMessage('Ticket créé avec succès');
          if (onTicketCreated) onTicketCreated(data);
          // Réinitialiser le formulaire
          setFormData({
            titre: '',
            description: '',
            statut: 'Ouvert',
            priorite: 'Faible',
            id_employe: 1
          });
        } else {
          setMessage(data.error || 'Erreur lors de la création du ticket');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        setMessage('Erreur lors de la création du ticket');
      });
  };

  return (
    <div>
      <h2>Créer un Ticket</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre :</label>
          <input 
            type="text" 
            name="titre" 
            value={formData.titre} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Description :</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Priorité :</label>
          <select name="priorite" value={formData.priorite} onChange={handleChange}>
            <option value="Faible">Faible</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Élevée">Élevée</option>
            <option value="Critique">Critique</option>
          </select>
        </div>
        {/* Le statut est fixé à "Ouvert" par défaut et ne peut pas être modifié ici */}
        <button type="submit">Créer le Ticket</button>
      </form>
    </div>
  );
}

export default TicketForm;
