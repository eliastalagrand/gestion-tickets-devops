import React from 'react';

function Header({ onLogout, userEmail }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>
      <h1>Gestion des Tickets</h1>
      <div>
        <span style={{ marginRight: '10px' }}>{userEmail}</span>
        <button onClick={onLogout}>Déconnexion</button>
      </div>
    </header>
  );
}

export default Header;
