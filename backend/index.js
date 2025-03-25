const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Routes pour les tickets
const ticketRoutes = require('./routes/tickets.routes');
app.use('/tickets', ticketRoutes);

// Routes pour les utilisateurs (authentification)
const userRoutes = require('./routes/users.routes');
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
