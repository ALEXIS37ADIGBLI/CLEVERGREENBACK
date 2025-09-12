const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

//Creer un utilisateur

module.exports.createUser = async (req, res) => {
    try {
        //On va prendre les informations dans la requête
        const { lastName, firstName, email, password } = req.body;

        //verifier si tous les informations nécessaires pour add un user  sont présent dans la requêtr
        if (!lastName || !firstName || !email || !password) {
            console.warn("Tous les champs sont obligatoires.");
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });

        }

        //Vérifier si l'utilisateur n'existe pas déjà dans la base de données
        const presentUser = await User.findOne({ email});
        if (presentUser) {
            console.warn("Cet utilisateur existe déjà.");
            return res.status(400).json({ error: "Cet utilisateur existe déjà." });
        }

        //Si l'utilisateur n'existe pas on passe donc a sa création

        //Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        //Création de l'utilisateur
        const newUser = new User({
            lastName,
            firstName,
            email,
            password: hashedPassword,
        });

        //On va donc l'enregistrer dans la base de données
        await newUser.save();

        //Prendre quelque info de l'utiliateur
        console.info(`Utilisateur créé: ${newUser._id}`);
        res.status(201).json({ success: true, userId: newUser._id });

        //Gestion des erreurs
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
    }
} 

// La fonction pour login un utilisateur

module.exports.loginUser = async (req, res) => {
    try {
        //Verifier si l'utilisateur existe
    const presentUser = await User.findOne({ email: req.body.email});

    if (!presentUser) {
        console.warn("Email introuvable");
        return res.status(400).json({ error: "L'email ou le mot de passe est incorrect." });
    }

    //Verifier si le mot de passe est correct
    const passwordCorrect = await bcrypt.compare(
        req.body.password,
        presentUser.password
    );

    if (!passwordCorrect) {
        console.warn("Mot de passe incorrect");
        return res.status(400).json({ error: "L'email ou le mot de passe est incorrect." });
    }

    //Si l'utilisateur existe et que le mot de passe est correct, on va créer une session
    req.session.user = {
        userId: presentUser._id,
        email: presentUser.email,
        lastName: presentUser.lastName,
        firstName: presentUser.firstName,
    };
    console.info(`Utilisateur connecté: ${presentUser._id}`);
    //Retourner les informations de l'utilisateur connecté
    res.status(200).json({ 
  success: true, 
  user: {
    userId: presentUser._id,
    email: presentUser.email,
    firstName: presentUser.firstName,
    lastName: presentUser.lastName,
  }, 
  message: "Login successful!" 
});
 
} catch (error) {
        console.error("Erreur lors de la connexion de l'utilisateur:", error);
        res.status(500).json({ error: "Erreur lors de la connexion de l'utilisateur." });
    }
    
}

//La fonction pour déconnecter un utilisateur
module.exports.logoutUser = async (req, res) => {
    req.session.destroy((err) => {
    })
    res.status(200).json({ message: "Déconnexion réussie." });
};