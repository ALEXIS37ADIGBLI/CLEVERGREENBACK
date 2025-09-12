//Gestion des routes pour les actions utilisateurs

const { Router } = require("express");
const userController = require("../controllers/UserController");
const router = Router();

//Création de l'utiisateur
router.post("/register", (req, res) => userController.createUser(req, res));

//Connexion de l'utilisateur
router.post("/login", (req, res) => userController.loginUser(req, res));

//Deconnecter l'utilisateur
router.post("/logout", (req, res) => userController.logoutUser(req, res));


module.exports = router;