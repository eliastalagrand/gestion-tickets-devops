import React, { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/users/login', {  // Grâce au proxy, ceci redirige vers http://localhost:3000/users/login
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mot_de_passe: motDePasse })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          // Sauvegarder le token (par exemple dans localStorage) et notifier le parent
          localStorage.setItem('token', data.token);
          onLoginSuccess(data.token);
        } else {
          setError(data.error || 'Erreur lors de la connexion');
        }
      })
      .catch(() => {
        setError('Erreur lors de la connexion');
      });
  };

  return (
    <div>
      <h2>Connexion</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email : </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe : </label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
