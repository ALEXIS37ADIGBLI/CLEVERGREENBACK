const validator = require("validator");
const mongoose = require("mongoose");

//Création d'un model utilisateur

const userSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: [true, "L'utilisateur doit avoie un NOM"],
    trim: true,
    minlength: [2, "Le nom doit contenir au moins 2 caractères"],
    maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    validate: {
      validator: function (value) {
        return validator.matches(
          value,
          /^[a-zA-Zàáâäãåąčćęèéêëìíîïłńòóôöõøùúûüýÿ\s'-]+$/
        );
      },
      message:
        "Le nom ne peut contenir que des lettres, espaces, apostrophes ou tirets",
    },
  },
  firstName: {
    type: String,
    required: [true, "Le prénom est obligatoire"],
    trim: true,
    minlength: [2, "Le prénom doit contenir au moins 2 caractères"],
    maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
    validate: {
      validator: function (value) {
        return validator.matches(
          value,
          /^[a-zA-Zàáâäãåąčćęèéêëìíîïłńòóôöõøùúûüýÿ\s'-]+$/
        );
      },
      message:
        "Le prénom ne peut contenir que des lettres, espaces, apostrophes ou tirets",
    },
  },
  email: {
    type: String,
    require: [true, "Email obligatoire"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Veuillez entrer une adresse email valide",
    },
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
  },
    createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
