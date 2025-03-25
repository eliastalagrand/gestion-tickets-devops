const bcrypt = require('bcrypt');

const password = "monMotDePasse";
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Hash généré :", hash);
  }
});
