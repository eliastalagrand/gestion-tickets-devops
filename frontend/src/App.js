import React, { useState } from 'react';
import Login from './components/Login';
import TicketList from './components/TicketList'; // Votre composant pour afficher les tickets

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  return (
    <div className="App">
      <h1>Plateforme de Gestion des Tickets</h1>
      {!token ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <p>Connecté avec succès !</p>
          {/* Vous pouvez ici intégrer d'autres composants, par exemple la liste des tickets */}
          <TicketList token={token} />
        </>
      )}
    </div>
  );
}

export default App;
