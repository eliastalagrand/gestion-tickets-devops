import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import Register from './components/Register';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import AdminDashboard from './components/AdminDashboard';
import TechnicianDashboard from './components/TechnicianDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [showRegister, setShowRegister] = useState(false);
  const [refreshTickets, setRefreshTickets] = useState(false);

  let userRole = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role; // Assurez-vous que c'est la valeur attendue (p. ex. "Admin", "Technicien", "Employ" ou "Employé")
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
    }
  }

  const toggleRegister = () => {
    setShowRegister(prev => !prev);
  };

  // Fonction pour rafraîchir la liste des tickets après création/modification
  const handleTicketCreated = (newTicket) => {
    setRefreshTickets(prev => !prev);
  };

  return (
    <div className="App">
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
          {userRole === 'Admin' && <AdminDashboard />}
          {userRole === 'Technicien' && <TechnicianDashboard />}
          {(userRole === 'Employ' || userRole === 'Employé') && <EmployeeDashboard />}
          <TicketForm token={token} onTicketCreated={handleTicketCreated} />
          <TicketList key={refreshTickets} token={token} />
        </>
      )}
    </div>
  );
}

export default App;
