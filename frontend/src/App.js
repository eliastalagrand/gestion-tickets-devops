import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import Register from './components/Register';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import AdminDashboard from './components/AdminDashboard';
import TechnicianDashboard from './components/TechnicianDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import Header from './components/Header';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [showRegister, setShowRegister] = useState(false);
  const [refreshTickets, setRefreshTickets] = useState(false);

  let userRole = null;
  let userEmail = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role; // Ex: "Admin", "Technicien", "Employ" (ou "Employé")
      userEmail = decoded.email;
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const toggleRegister = () => {
    setShowRegister(prev => !prev);
  };

  const handleTicketCreated = (newTicket) => {
    setRefreshTickets(prev => !prev);
  };

  return (
    <div className="App">
      {token && <Header onLogout={handleLogout} userEmail={userEmail} />}
      <h1>Plateforme de Gestion des Tickets</h1>
      {!token ? (
        <>
          {showRegister ? (
            <Register onRegisterSuccess={() => setShowRegister(false)} />
          ) : (
            <Login onLoginSuccess={(newToken) => {
              setToken(newToken);
              localStorage.setItem('token', newToken);
            }} />
          )}
          <button onClick={toggleRegister}>
            {showRegister ? "Retour à la connexion" : "Créer un compte"}
          </button>
        </>
      ) : (
        <>
          <p>Connecté avec succès !</p>
          {userRole === 'Admin' && (
            <>
              <AdminDashboard />
              {/* Pour Admin, on peut afficher toutes les fonctionnalités */}
              <TicketForm token={token} onTicketCreated={handleTicketCreated} />
              <TicketList key={refreshTickets} token={token} role={userRole} />
            </>
          )}
          {userRole === 'Technicien' && (
            <>
              <TechnicianDashboard />
              {/* Pour Technicien, on n'affiche pas le formulaire de création */}
              <TicketList key={refreshTickets} token={token} role={userRole} />
              {/* Vous pouvez ici ajouter des boutons "Mettre à jour" ou "Fermer" dans TicketList */}
            </>
          )}
          {(userRole === 'Employ' || userRole === 'Employé') && (
            <>
              <EmployeeDashboard />
              <TicketForm token={token} onTicketCreated={handleTicketCreated} />
              <TicketList key={refreshTickets} token={token} role={userRole} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
