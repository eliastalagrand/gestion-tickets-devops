// tickets.controller.js

// On importe la connexion (ou le pool) MySQL depuis db.config.js
const db = require('../config/db.config');

// Récupérer tous les tickets
exports.getAllTickets = (req, res) => {
  const sql = 'SELECT * FROM tickets';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des tickets :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des tickets.' });
    }
    res.json(results);
  });
};

// Récupérer un ticket par son ID
exports.getTicketById = (req, res) => {
  const ticketId = parseInt(req.params.id);
  const sql = 'SELECT * FROM tickets WHERE id = ?';
  db.query(sql, [ticketId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du ticket :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération du ticket.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Ticket non trouvé.' });
    }
    res.json(results[0]);
  });
};

// Créer un nouveau ticket
exports.createTicket = (req, res) => {
  const { titre, description, statut, priorite, id_employe } = req.body;
  const sql = `
    INSERT INTO tickets 
      (titre, description, statut, priorite, date_creation, date_mise_a_jour, id_employe)
    VALUES 
      (?, ?, ?, ?, NOW(), NOW(), ?)
  `;
  
  db.query(sql, [titre, description, statut || 'Ouvert', priorite || 'Faible', id_employe], (err, result) => {
    if (err) {
      console.error('Erreur lors de la création du ticket :', err);
      return res.status(500).json({ error: 'Erreur lors de la création du ticket.' });
    }
    const newTicket = {
      id: result.insertId,
      titre,
      description,
      statut: statut || 'Ouvert',
      priorite: priorite || 'Faible',
      date_creation: new Date(),
      date_mise_a_jour: new Date(),
      id_employe,
      id_technicien: null
    };
    res.status(201).json(newTicket);
  });
};

// Mettre à jour un ticket (tous les champs)
exports.updateTicket = (req, res) => {
  const ticketId = parseInt(req.params.id);
  const { titre, description, statut, priorite, id_employe, id_technicien, commentaires } = req.body;
  const sql = `
    UPDATE tickets 
    SET 
      titre = ?, 
      description = ?, 
      statut = ?, 
      priorite = ?, 
      date_mise_a_jour = NOW(), 
      id_employe = ?, 
      id_technicien = ?,
      commentaires = ?
    WHERE id = ?
  `;
  
  db.query(sql, [titre, description, statut, priorite, id_employe, id_technicien, commentaires, ticketId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du ticket :', err);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du ticket.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket non trouvé.' });
    }
    res.json({ message: 'Ticket mis à jour avec succès.' });
  });
};


// Nouvel endpoint pour mettre à jour uniquement le statut d'un ticket
exports.updateStatus = (req, res) => {
  const ticketId = parseInt(req.params.id);
  const { statut } = req.body;
  
  if (!statut) {
    return res.status(400).json({ error: 'Le champ "statut" est requis.' });
  }
  
  const sql = `
    UPDATE tickets
    SET statut = ?, date_mise_a_jour = NOW()
    WHERE id = ?
  `;
  
  db.query(sql, [statut, ticketId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du statut du ticket :', err);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du ticket.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket non trouvé.' });
    }
    res.json({ message: 'Statut mis à jour avec succès.' });
  });
};

// Supprimer un ticket
exports.deleteTicket = (req, res) => {
  const ticketId = parseInt(req.params.id);
  const sql = 'DELETE FROM tickets WHERE id = ?';
  
  db.query(sql, [ticketId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression du ticket :', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression du ticket.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket non trouvé.' });
    }
    res.status(204).send();
  });
};

// Mettre à jour uniquement le statut et le commentaire d'un ticket
exports.updateStatusAndComment = (req, res) => {
  const ticketId = parseInt(req.params.id);
  console.log('Requête reçue pour updateStatusAndComment:', req.body);
  const { statut, commentaires } = req.body;
  if (!statut) {
    return res.status(400).json({ error: 'Le champ "statut" est requis.' });
  }
  const sql = `
    UPDATE tickets
    SET statut = ?, commentaires = ?, date_mise_a_jour = NOW()
    WHERE id = ?
  `;
  db.query(sql, [statut, commentaires, ticketId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour:', err);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du ticket.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket non trouvé.' });
    }
    res.json({ message: 'Statut et commentaire mis à jour avec succès.' });
  });
};

