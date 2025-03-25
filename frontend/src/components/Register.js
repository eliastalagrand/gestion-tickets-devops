import React, { useState } from 'react';

function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    mot_de_passe: '',
    role: 'Employ'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/users/register', { // Le proxy redirige vers http://localhost:3000/users/register
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message);
          if (onRegisterSuccess) onRegisterSuccess();
        } else {
          setMessage(data.error || 'Erreur lors de l’inscription');
        }
      })
      .catch(() => setMessage('Erreur lors de l’inscription'));
  };

  return (
    <div>
      <h2>Inscription</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rôle :</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Employ">Employé</option>
            <option value="Technicien">Technicien</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default Register;
