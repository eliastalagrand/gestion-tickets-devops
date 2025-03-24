const express = require('express');
const app = express();
const port = 3000;

// Route pour tester le serveur
app.get('/', (req, res) => {
  res.send('Hello World from DevOps Project!');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
