import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import Register from './components/Register';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import AdminDashboard from './components/AdminDashboard';
import TechnicianDashboard from './components/TechnicianDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import UserManagement from './components/UserManagement';
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

  const handleTicketCreated = () => {
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
              <AdminDashboard token={token} />
              {/* Gestion des utilisateurs */}
              <UserManagement token={token} />
              {/* Pour Admin, on affiche également la création et la liste des tickets */}
              <TicketForm token={token} onTicketCreated={handleTicketCreated} />
              <TicketList key={refreshTickets} token={token} role={userRole} />
            </>
          )}
          {userRole === 'Technicien' && (
            <>
              <TechnicianDashboard token={token} />
              <TicketList key={refreshTickets} token={token} role={userRole} />
            </>
          )}
          {(userRole === 'Employ' || userRole === 'Employé') && (
            <>
              <EmployeeDashboard token={token} />
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
