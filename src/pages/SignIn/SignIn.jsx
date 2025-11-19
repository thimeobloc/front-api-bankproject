import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../src/pages/Beneficiary/Beneficiary.css";
import Cookies from "js-cookie";

export default function Signing() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Les mots de passe ne correspondent pas");
    return;
  }

  console.log("Envoi des données au serveur :", { name, email, password });

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/users/",
      { name, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Requête réussie !");
    console.log("Response complète :", response);
    console.log("Response.data :", response.data);

    Cookies.set("access_token", response.data.access_token, { expires: 1 });
    navigate("/Home");
  } catch (err) {
    console.error("❌ Erreur lors de la requête :", err);
    setError(err.response.data.detail || "Erreur lors de l'inscription");

    if (err.response) {
      // Le serveur a répondu avec un code d'erreur (400, 500, etc.)
      console.error("Détail de la réponse :", err.response.data);
      setError(err.response.data.detail || "Erreur lors de l'inscription");
    } else if (err.request) {
      // La requête a été envoyée mais aucune réponse n'a été reçue
      console.error("Pas de réponse du serveur :", err.request);
      setError("Erreur réseau ou serveur indisponible");
    } else {
      // Erreur côté axios ou autre
      console.error("Erreur inconnue :", err.message);
      setError("Erreur inattendue");
    }
  }
};

    return (
        <section>
            <div className="center">
                <div className="background">
                    <div className="SignForm">
                        <h1>Inscription</h1>
                        <input className="input_field" type="text" placeholder="Nom"
                               value={name} onChange={(e) => setName(e.target.value)} />
                        <input className="input_field" type="text" placeholder="Adresse Email"
                               value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input className="input_field" type="password" placeholder="Mot de passe"
                               value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <input className="input_field" type="password" placeholder="Confirmer le Mot de passe"
                               value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>

                        <button onClick={handleSubmit}> S'inscrire</button>
                        <button onClick={() => navigate("/Login")}> J'ai déja un compte</button>
                    </div>
                </div>
            </div>
        </section>
    );
}