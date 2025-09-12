const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- tu dois aussi importer cors
const UserRoute = require('./routes/UserRoute'); 
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); 
app.use(express.json());

const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Routes
app.use("/", UserRoute);

// Connexion MongoDB + lancement serveur
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.info('Connected to MongoDB');
    app.listen(5000, () => {
      console.info('Server is running on port 5000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
